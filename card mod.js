function actualizarcard(){
    const nombre = document.getElementById('nombre').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const descripcion = document.getElementById('descripcion').value;
    

    document.getElementById('card-type').textContent = nombre;
    document.getElementById('card-ubi').textContent = ubicacion;
    document.getElementById('card-info').textContent = descripcion;
    
}
