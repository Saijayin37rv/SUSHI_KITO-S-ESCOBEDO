// ==============================
// CONFIGURACIÓN Y DATOS
// ==============================
const WHATSAPP_NUMBER = '5218110729156'; 

const SAUCES = [
  'BBQ', 'Hot BBQ', 'Mango Habanero', 'Salsa Picante', 'Buffalo', 'Extra Picante', 'Lemon Pepper'
];

const SUSHI_FRESH = [
  { name: 'Philadelphia roll', desc: 'Salmón rosado, queso philadelphia, pepino fresco' },
  { name: 'Ginger Roll', desc: 'Salmón rosado, surimi, queso philadelphia, aguacate' },
  { name: 'California Roll', desc: 'Surimi, aguacate, queso philadelphia, pepino fresco' },
  { name: 'Camaron Roll', desc: 'Camarón, aguacate, queso philadelphia' },
  { name: 'Sushi de vegetales', desc: 'Aguacate, zanahoria, mix lechugas, pepino fresco' },
  { name: 'Uramaki de atún', desc: 'Atún fresco, aguacate, queso philadelphia' }
];

const SUSHI_FRIED = [
  { name: 'California Roll', desc: 'Frito. Surimi, aguacate, queso philadelphia, pepino fresco' },
  { name: 'Camaron Roll', desc: 'Frito. Camarón, aguacate, queso philadelphia' },
  { name: 'Uramaki de atún', desc: 'Frito. Atún fresco, aguacate, queso philadelphia' },
  { name: 'Queso Roll', desc: 'Frito. Queso manchego, queso panela, queso philadelphia' }
];

const CATALOG = [
  {
    section: 'SUSHI',
    items: [
      { id: 'sushi-combo-3', name: 'Sushi Combo 3', price: 130, image: 'sushi_combo3.jpg', desc: '1 rollo a elegir, arroz, papas.', options: { sushi: 'combo3' } },
      { id: 'sushi-combo-2', name: 'Sushi Combo 2', price: 200, image: 'sushi_combo2.jpg', desc: '2 rollos a elegir (frescos o fritos), arroz, papas.', options: { sushi: 'combo2' } },
      { id: 'sushi-combo-1', name: 'Sushi Combo 1', price: 230, image: 'sushi_combo1.jpg', desc: '1 rollo frito y 2 frescos, arroz frito, papas.', options: { sushi: 'combo1' } },
      { id: 'sushi-individual', name: 'Sushi Individual', price: 100, image: 'sushi_individual.jpg', desc: '1 rollo a elegir (fresco o frito).', options: { sushi: 'individual' } }
    ]
  }
];

// ==============================
// LÓGICA DE APLICACIÓN
// ==============================
let cart = [];
let currentItem = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
});

// Renderizar Menú con Mejor Diseño
function renderMenu() {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    CATALOG.forEach((cat, index) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'mb-12 fade-in-up';
        sectionDiv.style.animationDelay = `${index * 0.1}s`; // Efecto cascada
        
        let itemsHtml = '';
        cat.items.forEach(item => {
            // Imagen placeholder si no hay url real (Fallback robusto)
            const imgUrl = item.image && item.image.length > 0 ? item.image : `https://placehold.co/600x400/1a1a1a/dc2626?text=${encodeURIComponent(item.name)}`;
            
            // Fallback para error de carga de imagen local
            const errorAttr = `onerror="this.src='https://placehold.co/600x400/1a1a1a/dc2626?text=Sin+Imagen'"`;

            itemsHtml += `
                <div class="product-card bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-800 overflow-hidden flex flex-col h-full group">
                    <div class="img-container h-64 w-full relative">
                        <img src="${imgUrl}" alt="${item.name}" ${errorAttr} loading="lazy">
                        <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                            <span class="bg-brand text-white text-xs font-bold px-3 py-1.5 rounded shadow-md">$${item.price}</span>
                        </div>
                    </div>
                    
                    <div class="p-5 flex flex-col flex-grow relative">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-lg text-white leading-tight group-hover:text-brand transition-colors">${item.name}</h3>
                        </div>
                        <p class="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">${item.desc || 'Delicioso platillo preparado al momento.'}</p>
                        
                        <button onclick='initAddToCart(${JSON.stringify(item)})' class="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-brand hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center gap-2">
                            <i class="fas fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            `;
        });

        sectionDiv.innerHTML = `
            <h3 class="text-3xl font-extrabold mb-6 text-white border-l-4 border-brand pl-4 flex items-center gap-3">
                ${cat.section} 
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                ${itemsHtml}
            </div>
        `;
        container.appendChild(sectionDiv);
    });

    // Agregar sección de Próximamente
    const comingSoonDiv = document.createElement('div');
    comingSoonDiv.className = 'mb-12 fade-in-up mt-16';
    comingSoonDiv.style.animationDelay = '0.3s';
    
    comingSoonDiv.innerHTML = `
        <h3 class="text-3xl font-extrabold mb-6 text-white border-l-4 border-brand pl-4 flex items-center gap-3">
            <i class="fas fa-clock text-brand"></i> SOLO DICIEMBRE
        </h3>

        <!-- Temporada Navideña: Lasaña -->
        <div class="mb-6">
            <div class="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl shadow-lg border-2 border-gray-700 overflow-hidden p-6 relative">
                <div class="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent"></div>
                <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div class="md:col-span-2">
                        <h4 class="text-2xl font-extrabold text-white mb-2">🎄 Temporada Navideña — Lasaña</h4>
                        <p class="text-gray-300 mb-4">Lasaña casera preparada para compartir. <strong class="text-brand">Favor de pedir con anticipación para que esté a tiempo y sin prisas.</strong></p>
                        <ul class="text-gray-300 space-y-2">
                            <li class="flex justify-between items-center"><span>Para 5 a 6 personas</span><span class="font-bold text-white">$800</span></li>
                            <li class="flex justify-between items-center"><span>Para 10 a 12 personas</span><span class="font-bold text-white">$1600</span></li>
                            <li class="flex justify-between items-center"><span>Para 18 a 20 personas</span><span class="font-bold text-white">$2200</span></li>
                        </ul>

                        <div class="mt-4 inline-block bg-brand/20 text-brand px-4 py-2 rounded-full text-xs font-bold">Temporada</div>

                        <div class="mt-4 flex gap-3">
                            <button onclick="openLasagnaOrderModal('5-6')" class="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl shadow-lg transition">Pedir (5-6) — $800</button>
                            <button onclick="openLasagnaOrderModal('10-12')" class="w-full bg-[#2563eb] hover:bg-[#1e40af] text-white font-bold py-3 rounded-xl shadow-lg transition">Pedir (10-12) — $1600</button>
                            <button onclick="openLasagnaOrderModal('18-20')" class="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold py-3 rounded-xl shadow-lg transition">Pedir (18-20) — $2200</button>
                        </div>
                    </div>

                    <div class="md:col-span-1 grid grid-cols-2 gap-2">
                        <img src="lasana_f1.jpg" alt="Lasaña 1" class="w-full h-28 object-cover rounded-lg border border-gray-700" onerror="this.src='https://placehold.co/300x200/333/fff?text=Sin+Imagen'">
                        <img src="lasana_f2.jpg" alt="Lasaña 2" class="w-full h-28 object-cover rounded-lg border border-gray-700" onerror="this.src='https://placehold.co/300x200/333/fff?text=Sin+Imagen'">
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="coming-soon-card bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl shadow-lg border-2 border-gray-700 overflow-hidden p-8 text-center relative">
                <div class="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent"></div>
                <div class="relative z-10">
                    <div class="coming-soon-icon mb-4">
                        <i class="fas fa-drumstick-bite text-6xl text-brand"></i>
                    </div>
                    <h4 class="text-2xl font-bold text-white mb-2">BONELESS</h4>
                    <p class="text-gray-400 text-sm">Muy pronto estaremos agregando nuestros deliciosos boneless</p>
                    <div class="mt-4 inline-block bg-brand/20 text-brand px-4 py-2 rounded-full text-xs font-bold">
                        Próximamente
                    </div>
                </div>
            </div>
            <div class="coming-soon-card bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl shadow-lg border-2 border-gray-700 overflow-hidden p-8 text-center relative">
                <div class="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent"></div>
                <div class="relative z-10">
                    <div class="coming-soon-icon mb-4" style="animation-delay: 0.5s;">
                        <i class="fas fa-hamburger text-6xl text-brand"></i>
                    </div>
                    <h4 class="text-2xl font-bold text-white mb-2">HAMBURGUESAS</h4>
                    <p class="text-gray-400 text-sm">Próximamente tendremos hamburguesas deliciosas para ti</p>
                    <div class="mt-4 inline-block bg-brand/20 text-brand px-4 py-2 rounded-full text-xs font-bold">
                        Próximamente
                    </div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(comingSoonDiv);
}

// ==============================
// MODAL DE PERSONALIZACIÓN
// ==============================
function initAddToCart(item) {
    currentItem = item;
    const modalBody = document.getElementById('modal-body');
    let optionsHtml = '';

    // Lógica Salsas
    if (item.options && item.options.sauce === true) {
        optionsHtml += createSelect('Elige tu salsa:', 'selected_sauce', SAUCES);
    }
    if (item.options && item.options.customSauce) {
        optionsHtml += createSelect('Salsa para la hamburguesa:', 'selected_sauce', ['BBQ', 'Mango Habanero', 'Salsa Picante', 'Sin Salsa']);
    }

    // Lógica Papas
    if (item.options && item.options.friesDelta) {
        optionsHtml += `
            <div class="mb-5 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <label class="flex items-center space-x-3 cursor-pointer w-full">
                    <input type="checkbox" id="extra_fries" class="form-checkbox h-6 w-6 text-orange-600 rounded bg-gray-700 border-gray-600 focus:ring-orange-500">
                    <span class="text-white font-medium flex-1">Agrandar papas</span>
                    <span class="text-brand font-bold text-sm">+$${item.options.friesDelta}</span>
                </label>
            </div>
        `;
    }

    // Lógica Guarnición
    if (item.options && item.options.side) {
        optionsHtml += createSelect('Elige tu complemento:', 'selected_side', ['Spaghetti', 'Puré de Papa']);
    }
    
    // Lógica Sabores
     if (item.options && item.options.flavors) {
        optionsHtml += createSelect('Elige el sabor:', 'selected_flavor', item.options.flavors);
    }

    // Lógica Sushi
    if (item.options && item.options.sushi) {
        const type = item.options.sushi;
        if (type === 'individual' || type === 'combo3') {
            optionsHtml += createLabel('Selecciona tu Rollo:');
            optionsHtml += createSelect(null, 'sushi_roll_1', [...SUSHI_FRESH.map(s=>s.name + ' (Fresco)'), ...SUSHI_FRIED.map(s=>s.name + ' (Frito)')]);
        }
        else if (type === 'combo1') {
            optionsHtml += createLabel('Arma tu combo (1 Frito, 2 Frescos):');
            // *** CORRECCIÓN APLICADA AQUÍ ***
            optionsHtml += createSelect('Rollo 1 (Frito):', 'sushi_roll_1', SUSHI_FRIED.map(s=>s.name + ' (Frito)'));
            optionsHtml += createSelect('Rollo 2 (Fresco):', 'sushi_roll_2', SUSHI_FRESH.map(s=>s.name + ' (Fresco)'));
            optionsHtml += createSelect('Rollo 3 (Fresco):', 'sushi_roll_3', SUSHI_FRESH.map(s=>s.name + ' (Fresco)'));
            // ********************************
        }
        else if (type === 'combo2') {
            const allRolls = [...SUSHI_FRESH.map(s=>s.name + ' (Fresco)'), ...SUSHI_FRIED.map(s=>s.name + ' (Frito)')];
            optionsHtml += createLabel('Arma tu combo (2 Rollos a elegir):');
            optionsHtml += createSelect('Rollo 1:', 'sushi_roll_1', allRolls);
            optionsHtml += createSelect('Rollo 2:', 'sushi_roll_2', allRolls);
        }
    }

    // Fallback para imagen en modal
    const imgUrl = item.image && item.image.length > 0 ? item.image : `https://placehold.co/150x150/333/fff?text=IMG`;

    modalBody.innerHTML = `
        <div class="flex items-center gap-5 mb-6 pb-6 border-b border-gray-800">
             <img src="${imgUrl}" class="w-24 h-24 rounded-lg object-cover shadow-lg border border-gray-700" onerror="this.src='https://placehold.co/150x150/333/fff?text=IMG'">
             <div>
                <h3 class="text-2xl font-bold text-white leading-tight">${item.name}</h3>
                <p class="text-brand text-xl font-bold mt-1">$${item.price}</p>
             </div>
        </div>
        <div class="mb-6 text-gray-400 text-sm bg-gray-900/50 p-3 rounded border-l-2 border-gray-700 italic">${item.desc || 'Personaliza tu pedido a continuación.'}</div>
        
        <form id="add-form" onsubmit="confirmAddToCart(event)">
            ${optionsHtml}
            
            <div class="mt-6 mb-4">
                <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Nota especial (Opcional)</label>
                <input type="text" id="item_note" placeholder="Ej: Sin cebolla, aderezo aparte..." class="w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:border-brand focus:ring-1 focus:ring-brand transition">
            </div>

            <div class="flex items-center justify-between mt-8 bg-gray-800 p-3 rounded-lg border border-gray-700">
                <span class="text-white font-bold ml-2">Cantidad:</span>
                <div class="flex items-center bg-[#121212] rounded-lg p-1">
                    <button type="button" onclick="adjustQty(-1)" class="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded text-white font-bold transition">-</button>
                    <span id="modal-qty" class="font-bold text-xl w-10 text-center">1</span>
                    <button type="button" onclick="adjustQty(1)" class="w-10 h-10 bg-brand hover:bg-orange-600 rounded text-white font-bold transition">+</button>
                </div>
            </div>

            <button type="submit" class="w-full bg-brand-gradient text-white font-bold py-4 mt-6 rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition transform hover:-translate-y-1">
                Confirmar y Agregar
            </button>
        </form>
    `;

    openModal('product-modal');
}

function createLabel(text) {
     return `<p class="text-brand font-bold mb-3 uppercase text-sm tracking-wider">${text}</p>`;
}

function createSelect(label, id, optionsArray) {
    let opts = optionsArray.map(opt => `<option value="${opt}">${opt}</option>`).join('');
    let labelHtml = label ? `<label class="block text-sm text-gray-300 mb-2 font-medium">${label}</label>` : '';
    return `
        <div class="mb-4">
            ${labelHtml}
            <div class="relative">
                <select id="${id}" class="appearance-none w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition cursor-pointer">
                    ${opts}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
            </div>
        </div>
    `;
}

let modalQty = 1;
function adjustQty(delta) {
    modalQty += delta;
    if (modalQty < 1) modalQty = 1;
    document.getElementById('modal-qty').innerText = modalQty;
}

function confirmAddToCart(e) {
    e.preventDefault();
    
    // Recolectar opciones
    let finalOptions = [];
    let extraPrice = 0;

    const sauceEl = document.getElementById('selected_sauce');
    if (sauceEl) finalOptions.push(`Salsa: ${sauceEl.value}`);
    
    const sideEl = document.getElementById('selected_side');
    if (sideEl) finalOptions.push(`Comple: ${sideEl.value}`);

    const flavorEl = document.getElementById('selected_flavor');
    if (flavorEl) finalOptions.push(`Sabor: ${flavorEl.value}`);

    for(let i=1; i<=3; i++) {
        const roll = document.getElementById(`sushi_roll_${i}`);
        if (roll) finalOptions.push(`Rollo ${i}: ${roll.value}`);
    }

    const friesCheck = document.getElementById('extra_fries');
    if (friesCheck && friesCheck.checked) {
        extraPrice += currentItem.options.friesDelta;
        finalOptions.push('Papas Agrandadas');
    }

    const note = document.getElementById('item_note').value;
    if (note) finalOptions.push(`Nota: ${note}`);

    const cartItem = {
        ...currentItem,
        qty: modalQty,
        finalPrice: currentItem.price + extraPrice,
        selectedOptions: finalOptions
    };

    cart.push(cartItem);
    updateCartUI();
    closeModal('product-modal');
    showToast(); // Mostrar confirmación visual
    modalQty = 1;
}

// ==============================
// GESTIÓN DEL CARRITO
// ==============================
function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const floatTotal = document.getElementById('float-total');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');

    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    
    // Animación del badge
    if (totalItems > 0) {
        countEl.innerText = totalItems;
        countEl.classList.remove('scale-0');
        countEl.classList.add('scale-100');
    } else {
        countEl.classList.add('scale-0');
        countEl.classList.remove('scale-100');
    }

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center py-10 text-gray-500">
                <i class="fas fa-utensils text-4xl mb-3 opacity-30"></i>
                <p>Tu carrito está vacío</p>
            </div>`;
        floatTotal.innerText = '$0';
        cartTotalEl.innerText = '$0.00';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.finalPrice * item.qty;
        total += subtotal;
        
        html += `
            <div class="flex justify-between items-start bg-[#121212] p-4 rounded-lg border border-gray-800 relative group transition hover:border-gray-600">
                <div class="pr-6">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="bg-brand text-white text-xs font-bold px-1.5 py-0.5 rounded">${item.qty}x</span>
                        <p class="font-bold text-white text-lg">${item.name}</p>
                    </div>
                    <p class="text-xs text-gray-400 leading-relaxed mb-2 pl-7">${item.selectedOptions.join(', ')}</p>
                    <div class="text-xs text-brand font-bold pl-7">$${item.finalPrice} c/u</div>
                </div>
                <div class="flex flex-col items-end justify-between h-full">
                    <p class="font-bold text-white text-lg">$${subtotal}</p>
                    <button onclick="removeFromCart(${index})" class="text-red-500 text-sm hover:text-red-400 mt-2 bg-red-500/10 p-2 rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-red-500/20"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    floatTotal.innerText = `$${total}`;
    cartTotalEl.innerText = `$${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// ==============================
// LÓGICA DE PAGO
// ==============================
function toggleBankDetails() {
    const method = document.getElementById('payment-method').value;
    const details = document.getElementById('bank-details');
    if(method === 'Transferencia') {
        details.classList.remove('hidden');
    } else {
        details.classList.add('hidden');
    }
}

function sendToWhatsapp(e) {
    e.preventDefault();
    if (cart.length === 0) return alert('Agrega productos al carrito primero.');

    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const comments = document.getElementById('customer-comments').value;
    const paymentMethod = document.getElementById('payment-method').value; // Obtener el método de pago

    let message = `*🍣 NUEVO PEDIDO SUSHI KITO'S ESCOBEDO*\n`;
    message += `📅 Fecha: ${new Date().toLocaleDateString()}\n`;
    message += `--------------------------------\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📍 *Dirección:* ${address}\n`;
    
    // Agregar el método de pago al mensaje
    message += `💳 *Método de Pago:* ${paymentMethod}\n`; 
    if(paymentMethod === 'Transferencia') {
        message += `ℹ️ _Cliente debe enviar comprobante de pago por ${paymentMethod} al confirmar._\n`;
    }
    
    if(comments) message += `📝 *Comentarios:* ${comments}\n`;
    message += `--------------------------------\n`;
    message += `*DETALLE DEL PEDIDO:*\n`;
    
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.finalPrice * item.qty;
        total += subtotal;
        message += `▪️ *${item.qty}x ${item.name}*\n`;
        if(item.selectedOptions.length > 0) {
            message += `   _(${item.selectedOptions.join(', ')})_\n`;
        }
        message += `   $${subtotal}\n`;
    });

    message += `--------------------------------\n`;
    message += `💰 *TOTAL PRODUCTOS: $${total}*\n`;
    message += `🛵 _(El costo de envío se calculará en este chat)_\n`;
    message += `✅ Acepto el aviso de privacidad.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Función para abrir WhatsApp con pedido prellenado para la lasaña
function openWhatsAppLasagna(sizeKey) {
    const prices = {
        '5-6': 800,
        '10-12': 1600,
        '18-20': 2200
    };
    const sizeLabel = {
        '5-6': 'Para 5 a 6 personas',
        '10-12': 'Para 10 a 12 personas',
        '18-20': 'Para 18 a 20 personas'
    };

    const price = prices[sizeKey] || 0;
    const label = sizeLabel[sizeKey] || sizeKey;

    let message = `*🍝 PEDIDO - LASAÑA (Temporada Navideña)*\n`;
    message += `Tamaño: ${label}\n`;
    message += `Precio: $${price}\n`;
    message += `\nPor favor completa los datos del pedido:\n`;
    message += `Nombre: \n`;
    message += `Dirección: \n`;
    message += `Teléfono: \n`;
    message += `Comentarios (opcional): \n`;
    message += `\n*Favor de pedir con anticipación para que esté a tiempo y sin prisas.*`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Abre modal para llenar datos antes de enviar pedido de lasaña
function openLasagnaOrderModal(sizeKey) {
    modalQty = 1; // reset quantity
    const prices = {
        '5-6': 800,
        '10-12': 1600,
        '18-20': 2200
    };
    const sizeLabel = {
        '5-6': 'Para 5 a 6 personas',
        '10-12': 'Para 10 a 12 personas',
        '18-20': 'Para 18 a 20 personas'
    };

    const price = prices[sizeKey] || 0;
    const label = sizeLabel[sizeKey] || sizeKey;

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="flex items-center gap-5 mb-6 pb-6 border-b border-gray-800">
             <img src="lasana_f1.jpg" class="w-24 h-24 rounded-lg object-cover shadow-lg border border-gray-700" onerror="this.src='https://placehold.co/150x150/333/fff?text=IMG'">
             <div>
                <h3 class="text-2xl font-bold text-white leading-tight">Lasaña - Temporada Navideña</h3>
                <p class="text-brand text-xl font-bold mt-1">$${price}</p>
                <p class="text-gray-400 text-sm mt-1">${label}</p>
             </div>
        </div>

        <form id="lasagna-form" onsubmit="sendLasagnaToWhatsapp(event)">
            <input type="hidden" id="lasagna-size" value="${sizeKey}">
            <div class="space-y-3">
                <div>
                    <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tu Nombre</label>
                    <input id="lasagna-name" required class="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 px-3 text-white mt-2" placeholder="Ej. Juan Pérez">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Dirección</label>
                    <input id="lasagna-address" required class="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 px-3 text-white mt-2" placeholder="Calle, Número, Colonia">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Teléfono</label>
                    <input id="lasagna-phone" required class="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 px-3 text-white mt-2" placeholder="55 0000 0000">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Comentarios (opcional)</label>
                    <textarea id="lasagna-comments" class="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 px-3 text-white mt-2" rows="2" placeholder="Ej: Sin cebolla, llegada a las 7pm"></textarea>
                </div>

                <div class="flex items-center justify-between mt-2 bg-gray-800 p-3 rounded-lg border border-gray-700">
                    <span class="text-white font-bold ml-2">Cantidad:</span>
                    <div class="flex items-center bg-[#121212] rounded-lg p-1">
                        <button type="button" onclick="adjustQty(-1)" class="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded text-white font-bold transition">-</button>
                        <span id="modal-qty" class="font-bold text-xl w-10 text-center">1</span>
                        <button type="button" onclick="adjustQty(1)" class="w-10 h-10 bg-brand hover:bg-orange-600 rounded text-white font-bold transition">+</button>
                    </div>
                </div>

                <div class="mt-4">
                    <button type="submit" class="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl shadow-lg transition">Enviar a WhatsApp</button>
                </div>
            </div>
        </form>
    `;

    openModal('product-modal');
}

function sendLasagnaToWhatsapp(e) {
    e.preventDefault();
    const sizeKey = document.getElementById('lasagna-size').value;
    const name = document.getElementById('lasagna-name').value.trim();
    const address = document.getElementById('lasagna-address').value.trim();
    const phone = document.getElementById('lasagna-phone').value.trim();
    const comments = document.getElementById('lasagna-comments').value.trim();

    const prices = { '5-6': 800, '10-12': 1600, '18-20': 2200 };
    const sizeLabel = { '5-6': 'Para 5 a 6 personas', '10-12': 'Para 10 a 12 personas', '18-20': 'Para 18 a 20 personas' };

    const price = prices[sizeKey] || 0;
    const label = sizeLabel[sizeKey] || sizeKey;
    const qty = parseInt(document.getElementById('modal-qty').innerText) || 1;
    const subtotal = price * qty;

    let message = `*🍝 NUEVO PEDIDO - LASAÑA (Temporada Navideña)*\n`;
    message += `👤 Cliente: ${name}\n`;
    message += `📞 Tel: ${phone}\n`;
    message += `📍 Dirección: ${address}\n`;
    message += `Tamaño: ${label} (${qty} unidad(es))\n`;
    if (comments) message += `📝 Comentarios: ${comments}\n`;
    message += `--------------------------------\n`;
    message += `💰 Total: $${subtotal}\n`;
    message += `\n*Favor de pedir con anticipación para que esté a tiempo y sin prisas.*`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    closeModal('product-modal');
}

// ==============================
// UTILIDADES UI
// ==============================
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden'; // Evitar scroll del body
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}
function openCart() {
    openModal('cart-modal');
}

function showToast() {
    const toast = document.getElementById("toast");
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) closeModal(overlay.id);
    });
});

