const añoActual = () => {
    return new Date().getFullYear()    
}

const numeroConSeparadorMiles = (value) => {
    return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}
  


module.exports = {
    añoActual,
    numeroConSeparadorMiles
}