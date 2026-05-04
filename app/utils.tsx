export function formatDate(dateString: string) {
  const date = new Date(dateString)

  const day = date.getDate()
  const year = date.getFullYear()

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const month = months[date.getMonth()]

  return `${day} de ${month} de ${year}`
}