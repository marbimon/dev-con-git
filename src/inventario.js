// 1. Estructura base
// ============================================

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ARRAY DE OBJETOS - Estructura principal del inventario
// Cada producto es un objeto con: id, nombre, precio, stock
let inventario = [
    { id: 1, nombre: "Laptop Gamer", precio: 1200, stock: 15 },
    { id: 2, nombre: "Mouse Inalámbrico", precio: 35.99, stock: 45 },
    { id: 3, nombre: "Teclado Mecánico", precio: 89.99, stock: 30 }
];

let siguienteId = 4;

function iniciarGestor() {
    console.log("\n🚀 ¡Bienvenido al Gestor de Inventario!");
    console.log(`📊 Inventario actual: ${inventario.length} productos`);
    mostrarMenu();
    preguntarOpcion();
}

// 2. Agregar y listar productos
// ============================================

function agregarProducto() {
    rl.question("\n📝 Nombre del producto: ", (nombre) => {
        if (!nombre.trim()) {
            console.log("❌ Error: El nombre no puede estar vacío.");
            mostrarMenu();
            preguntarOpcion();
            return;
        }
        
        rl.question("💰 Precio del producto: ", (precio) => {
            const precioNum = parseFloat(precio);
            if (isNaN(precioNum) || precioNum <= 0) {
                console.log("❌ Error: Precio inválido. Debe ser un número mayor a 0.");
                mostrarMenu();
                preguntarOpcion();
                return;
            }
            
            rl.question("📦 Stock disponible: ", (stock) => {
                const stockNum = parseInt(stock);
                if (isNaN(stockNum) || stockNum < 0) {
                  console.log("❌ Error: Stock inválido. Debe ser un número mayor o igual a 0.");
                  mostrarMenu();
                  preguntarOpcion();
                  return;
                }
                
                // Usamos push() para agregar al final del array
                const nuevoProducto = {
                    id: siguienteId++,
                    nombre: nombre.trim(),
                    precio: precioNum,
                    stock: stockNum
                };
                
                inventario.push(nuevoProducto);
                console.log(`\n✅ Producto "${nombre}" agregado con ID ${nuevoProducto.id}`);
                mostrarMenu();
                preguntarOpcion();
            });
        });
    });
}

function listarProductos() {
    if (inventario.length === 0) {
        console.log("\n📭 El inventario está vacío. Agrega productos usando la opción 1.");
        mostrarMenu();
        preguntarOpcion();
        return;
    }
    
    console.log("\n📋 LISTA DE PRODUCTOS:");
    console.log("=================================");
    
    // Usamos forEach para recorrer el array de objetos
    inventario.forEach(producto => {
        console.log(`   ID: ${producto.id}`);
        console.log(`   Nombre: ${producto.nombre}`);
        console.log(`   Precio: $${producto.precio.toFixed(2)}`);
        console.log(`   Stock: ${producto.stock} unidades`);
        console.log("   ---------------------------------");
    });
    
    // Mostrar resumen con map (transformación)
    const nombres = inventario.map(p => p.nombre);
    console.log(`📊 Total de productos: ${inventario.length}`);
    console.log(`📋 Productos: ${nombres.join(", ")}`);
    
    mostrarMenu();
    preguntarOpcion();
}

// 3. Buscar y calcular valor total
// ============================================

function buscarProducto() {
    rl.question("\n🔍 Nombre del producto a buscar: ", (nombreBuscado) => {
        if (!nombreBuscado.trim()) {
            console.log("❌ Error: Ingresa un nombre para buscar.");
            mostrarMenu();
            preguntarOpcion();
            return;
        }
        
        // find - devuelve el PRIMER elemento que cumple la condición
        const encontrado = inventario.find(producto => 
            producto.nombre.toLowerCase().includes(nombreBuscado.toLowerCase())
        );
        
        if (encontrado) {
            console.log("\n✅ PRODUCTO ENCONTRADO:");
            console.log("=================================");
            console.log(`   ID: ${encontrado.id}`);
            console.log(`   Nombre: ${encontrado.nombre}`);
            console.log(`   Precio: $${encontrado.precio.toFixed(2)}`);
            console.log(`   Stock: ${encontrado.stock} unidades`);
            console.log("=================================");
        } else {
            console.log(`\n❌ No se encontró ningún producto con nombre "${nombreBuscado}"`);
            
            // Sugerir productos similares con filter
            const similares = inventario.filter(producto => 
                producto.nombre.toLowerCase().includes(nombreBuscado.toLowerCase().substring(0, 3))
            );
            
            if (similares.length > 0) {
                console.log("\n💡 Productos similares disponibles:");
                similares.forEach(p => console.log(`   - ${p.nombre}`));
            }
        }
        
        mostrarMenu();
        preguntarOpcion();
    });
}

function calcularValorTotal() {
    if (inventario.length === 0) {
        console.log("\n📭 El inventario está vacío. Valor total: $0.00");
        mostrarMenu();
        preguntarOpcion();
        return;
    }
    
    // reduce - acumula los valores para obtener un solo resultado
    // acumulador (total) empieza en 0, por cada producto suma precio * stock
    const valorTotal = inventario.reduce((total, producto) => {
        return total + (producto.precio * producto.stock);
    }, 0);
    
    console.log("\n💰 VALOR TOTAL DEL INVENTARIO");
    console.log("=================================");
    console.log(`   Total de productos: ${inventario.length}`);
    console.log(`   Valor total: $${valorTotal.toFixed(2)}`);
    console.log("=================================");
    
    // Mostrar desglose por producto usando map
    console.log("\n📊 DESGLOSE POR PRODUCTO:");
    inventario.map(producto => {
        const valor = producto.precio * producto.stock;
        console.log(`   • ${producto.nombre}: ${producto.stock} × $${producto.precio} = $${valor.toFixed(2)}`);
    });
    
    mostrarMenu();
    preguntarOpcion();
}

// 4. Eliminar producto y estadísticas
// ============================================

function mostrarEstadisticas() {
    if (inventario.length === 0) return;
    
    const totalProductos = inventario.length;
    const valorTotal = inventario.reduce((total, p) => total + (p.precio * p.stock), 0);
    const precioPromedio = inventario.reduce((total, p) => total + p.precio, 0) / totalProductos;
    const productoMasCaro = inventario.reduce((max, p) => p.precio > max.precio ? p : max, inventario[0]);
    const productoConMasStock = inventario.reduce((max, p) => p.stock > max.stock ? p : max, inventario[0]);
    
    console.log("\n📊 ESTADÍSTICAS DEL INVENTARIO");
    console.log("=================================");
    console.log(`   📦 Total productos: ${totalProductos}`);
    console.log(`   💰 Valor total: $${valorTotal.toFixed(2)}`);
    console.log(`   📈 Precio promedio: $${precioPromedio.toFixed(2)}`);
    console.log(`   👑 Producto más caro: ${productoMasCaro.nombre} ($${productoMasCaro.precio})`);
    console.log(`   📊 Mayor stock: ${productoConMasStock.nombre} (${productoConMasStock.stock} uds)`);
    console.log("=================================");
}

function eliminarProducto() {
    if (inventario.length === 0) {
        console.log("\n📭 El inventario está vacío. No hay productos para eliminar.");
        mostrarMenu();
        preguntarOpcion();
        return;
    }
    
    listarProductosResumido();
    
    rl.question("\n🗑️ Ingresa el ID del producto a eliminar: ", (idInput) => {
        const id = parseInt(idInput);
        
        if (isNaN(id)) {
            console.log("❌ Error: Debes ingresar un número de ID válido.");
            mostrarMenu();
            preguntarOpcion();
            return;
        }
        
        // Buscar el producto antes de eliminar
        const productoAEliminar = inventario.find(p => p.id === id);
        
        if (!productoAEliminar) {
            console.log(`❌ No existe un producto con ID ${id}`);
            mostrarMenu();
            preguntarOpcion();
            return;
        }
        
        console.log(`\n⚠️ Producto a eliminar:`);
        console.log(`   "${productoAEliminar.nombre}" (ID: ${id})`);
        console.log(`   Precio: $${productoAEliminar.precio}`);
        console.log(`   Stock: ${productoAEliminar.stock} unidades`);
        
        rl.question("\n¿Estás seguro? (s/n): ", (confirmacion) => {
            if (confirmacion.toLowerCase() === 's') {
                // filter - crea un nuevo array SIN el producto eliminado
                const nuevosProductos = inventario.filter(p => p.id !== id);
                const eliminados = inventario.length - nuevosProductos.length;
                
                inventario = nuevosProductos;
                console.log(`\n✅ Producto "${productoAEliminar.nombre}" eliminado correctamente.`);
                console.log(`   Productos restantes: ${inventario.length}`);
            } else {
                console.log("\n❌ Eliminación cancelada.");
            }
            
            mostrarMenu();
            preguntarOpcion();
        });
    });
}

function listarProductosResumido() {
    console.log("\n📋 PRODUCTOS DISPONIBLES:");
    console.log("=================================");
    inventario.forEach(p => {
        console.log(`   ID ${p.id}: ${p.nombre} - $${p.precio} (Stock: ${p.stock})`);
    });
    console.log("=================================");
}

function listarProductos() {
    if (inventario.length === 0) {
        console.log("\n📭 El inventario está vacío. Agrega productos usando la opción 1.");
        mostrarMenu();
        preguntarOpcion();
        return;
    }
    
    console.log("\n📋 LISTA DE PRODUCTOS:");
    console.log("=================================");
    
    inventario.forEach(producto => {
        console.log(`   ${producto.id}. ${producto.nombre}`);
        console.log(`      Precio: $${producto.precio.toFixed(2)}`);
        console.log(`      Stock: ${producto.stock} unidades`);
        console.log("   ---------------------------------");
    });
    
    mostrarEstadisticas();
    mostrarMenu();
    preguntarOpcion();
}

// Actualizar mostrarMenu para incluir opción de estadísticas rápidas
function mostrarMenu() {
    const statsInfo = inventario.length > 0 
        ? ` (${inventario.length} productos)` 
        : " (vacío)";
    
    console.log("\n=================================");
    console.log(`     📦 GESTOR DE INVENTARIO${statsInfo}`);
    console.log("=================================");
    console.log("  1. ➕ Agregar producto");
    console.log("  2. 📋 Listar productos detallado");
    console.log("  3. 🔍 Buscar producto");
    console.log("  4. 💰 Calcular valor total");
    console.log("  5. 🗑️ Eliminar producto");
    console.log("  6. 🚪 Salir");
    console.log("=================================");
}

// Actualizar preguntarOpcion con la opción eliminar
function preguntarOpcion() {
    rl.question("\n📌 Elige una opción (1-6): ", (opcion) => {
        if (opcion === '6') {
            console.log("\n👋 ¡Hasta luego! Gracias por usar el Gestor de Inventario.\n");
            mostrarEstadisticasFinales();
            rl.close();
            return;
        }
        
        switch (opcion) {
            case '1':
                agregarProducto();
                break;
            case '2':
                listarProductos();
                break;
            case '3':
                buscarProducto();
                break;
            case '4':
                calcularValorTotal();
                break;
            case '5':
                eliminarProducto();
                break;
            default:
                console.log("\n❌ Opción no válida. Intenta de nuevo (1-6).");
                mostrarMenu();
                preguntarOpcion();
        }
    });
}

function mostrarEstadisticasFinales() {
    if (inventario.length === 0) return;
    
    console.log("\n📊 ESTADÍSTICAS FINALES DE LA SESIÓN:");
    const valorTotal = inventario.reduce((total, p) => total + (p.precio * p.stock), 0);
    console.log(`   Total de productos gestionados: ${inventario.length}`);
    console.log(`   Valor total del inventario: $${valorTotal.toFixed(2)}`);
}

// Iniciar el gestor
iniciarGestor();
