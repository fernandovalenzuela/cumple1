"use client";

import { useEffect,useRef,useState } from "react";
import { PaymentStatus } from "@/lib/constants";
import { PaymentResult as PaymentResultDto } from "@/payment/dto/paymentDTOs";
import { getPaymentResult, createPayment } from "@/onboarding/payment/payment.actions";
import PaymentResult from "./PaymentResult";

interface PaymentResultContainerProps{
    eventId: number;
    payment:PaymentResultDto;
    onPaymentChanged:(payment:PaymentResultDto)=>void;
}

const POLLING_INTERVAL_MS=2000;
const MAX_POLLING_TIME_MS=30000;

export default function PaymentResultContainer({
    eventId,
    payment,
    onPaymentChanged,
}:PaymentResultContainerProps){

    const [loading,setLoading]=useState(false);
    const [pollingFinished,setPollingFinished]=useState(false);
    const [retrying,setRetrying]=useState(false);

    const cancelledRef=useRef(false);

    function isPending(status:PaymentStatus){

        return status===PaymentStatus.Created||
            status===PaymentStatus.Pending||
            status===PaymentStatus.WaitingPayment||
            status===PaymentStatus.PendingVerification;

    }

    async function handleRetry(){
        if(retrying){
            return;
        }
        try{
            setRetrying(true);
            const result=await createPayment();
            if(result && result.success){
                window.location.href=result.checkoutUrl;
                return;
            }
            // Si hubo un error de negocio simplemente
            // dejamos que la UI actualice el mensaje.
            // No debería ocurrir normalmente.
        }
        finally{
            setRetrying(false);
        }
    }

    useEffect(()=>{
        if(!isPending(payment.status)){
            return;
        }
        cancelledRef.current=false;
        const startTime=Date.now();
        async function poll(){
            console.log("# POLL");
            if(cancelledRef.current){
                return;
            }
            if(Date.now()-startTime>=MAX_POLLING_TIME_MS){
                console.log("POLL: finished");
                setPollingFinished(true);
                return;
            }
            const result=await getPaymentResult();

            if(cancelledRef.current){
                return;
            }
            console.log("POLL: antes onPaymentChanged");
            onPaymentChanged(result);
            console.log("POLL: despues onPaymentChanged");

            if(isPending(result.status)){
                setTimeout(
                    poll,
                    POLLING_INTERVAL_MS
                );
            } else {
                console.log("POLL: no pendiente");
            }
        }

        const timeoutId=setTimeout(
            poll,
            POLLING_INTERVAL_MS
        );
        return()=>{
            cancelledRef.current=true;
            clearTimeout(timeoutId);
        };
    },[]);

    
    async function startPolling() {
        cancelledRef.current = false;
        const startTime = Date.now();
        async function poll() {
            if (cancelledRef.current) {
                return;
            }
            if (Date.now() - startTime >= MAX_POLLING_TIME_MS) {
                setPollingFinished(true);
                return;
            }
            const result = await getPaymentResult();
            if (cancelledRef.current) {
                return;
            }
            onPaymentChanged(result);
            if (isPending(result.status)) {
                setTimeout(
                    poll,
                    POLLING_INTERVAL_MS
                );
            }
        }
        setTimeout(
            poll,
            POLLING_INTERVAL_MS
        );
    }

    async function handleRefresh() {
        if (loading) {
            return;
        }
        try {
            setLoading(true);
            const result = await getPaymentResult();
            onPaymentChanged(result);
            // Si continúa pendiente, dejamos visible el botón.
            setPollingFinished(isPending(result.status));
        }
        finally {
            setLoading(false);
        }
    }

    return(
        <PaymentResult
            eventId={eventId}
            payment={payment}
            showRefreshButton={pollingFinished}
            refreshing={loading}
            onRefresh={handleRefresh}
            retrying={retrying}
            onRetry={handleRetry}
        />
    );

}