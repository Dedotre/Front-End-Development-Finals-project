const API_URL = 'https://fakestoreapi.com/products';

const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
const saveCart = (data) => localStorage.setItem('cart', JSON.stringify(data));

const updateCartBadge = () => {
    const count = getCart().reduce((sum, i) => sum + i.qty, 0);
    const badge = document.getElementById('navCartCount');
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
};
updateCartBadge();

document.getElementById('hamburgerBtn')?.addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('active');
});

if (document.getElementById('productsContainer')) {
    let allProducts = [];

    const renderProducts = (list) => {
        document.getElementById('productsContainer').innerHTML = list.map(p => `
            <div class="product-card">
                <div class="product-img-holder"><img src="${p.image}" alt=""></div>
                <div>
                    <h3 class="product-title">${p.title}</h3>
                    <p class="product-price">$${p.price.toFixed(2)}</p>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <a href="product-detail.html?id=${p.id}" class="btn btn-secondary">Details</a>
                    <button class="btn btn-primary add-cart" data-id="${p.id}" data-title="${p.title}" data-price="${p.price}">Add</button>
                </div>
            </div>
        `).join('');
    };

    (async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error();
            allProducts = await res.json();
            document.getElementById('loadingIndicator').remove();
            renderProducts(allProducts);
        } catch {
            document.getElementById('loadingIndicator').textContent = "Failed loading data.";
        }
    })();

    document.getElementById('productSearch')?.addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        renderProducts(allProducts.filter(p => p.title.toLowerCase().includes(q)));
    });

    document.getElementById('productsContainer').addEventListener('click', e => {
        if (e.target.classList.contains('add-cart')) {
            const cart = getCart();
            const id = parseInt(e.target.dataset.id);
            const match = cart.find(i => i.id === id);
            if (match) match.qty++; 
            else cart.push({ id, title: e.target.dataset.title, price: parseFloat(e.target.dataset.price), qty: 1 });
            saveCart(cart);
            updateCartBadge();
            e.target.textContent = 'Added';
        }
    });
}

if (document.getElementById('detailContainer')) {
    (async () => {
        const id = new URLSearchParams(window.location.search).get('id');
        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) throw new Error();
            const p = await res.json();
            document.getElementById('loadingIndicator').remove();
            document.getElementById('detailContainer').innerHTML = `
                <div class="detail-image"><img src="${p.image}" alt=""></div>
                <div class="detail-info">
                    <h2>${p.title}</h2>
                    <p class="product-price">$${p.price.toFixed(2)}</p>
                    <p style="margin:20px 0; color:var(--muted);">${p.description}</p>
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
                        <button class="btn btn-secondary" id="qtyMinus">-</button>
                        <span id="qtyValue">1</span>
                        <button class="btn btn-secondary" id="qtyPlus">+</button>
                    </div>
                    <button id="addDetailBtn" class="btn btn-primary">Buy</button>
                </div>
            `;
            let qty = 1;
            document.getElementById('qtyMinus').addEventListener('click', () => {
                if (qty > 1) qty--;
                document.getElementById('qtyValue').textContent = qty;
            });
            document.getElementById('qtyPlus').addEventListener('click', () => {
                qty++;
                document.getElementById('qtyValue').textContent = qty;
            });
            document.getElementById('addDetailBtn').addEventListener('click', () => {
                const cart = getCart();
                const match = cart.find(i => i.id === p.id);
                if (match) match.qty += qty; else cart.push({ id: p.id, title: p.title, price: p.price, qty });
                saveCart(cart);
                updateCartBadge();
            });
        } catch {
            document.getElementById('loadingIndicator').textContent = "Failed loading product view.";
        }
    })();
}

if (document.getElementById('cartItemsContainer')) {
    const render = () => {
        const items = getCart();
        document.getElementById('cartItemsContainer').innerHTML = items.length 
            ? items.map(i => `
                <div class="cart-item-row">
                    <div><strong>${i.title}</strong></div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button class="btn btn-secondary qty-btn" data-id="${i.id}" data-delta="-1">-</button>
                        <span>${i.qty}</span>
                        <button class="btn btn-secondary qty-btn" data-id="${i.id}" data-delta="1">+</button>
                        <span>$${(i.price * i.qty).toFixed(2)}</span>
                    </div>
                </div>`).join('') + `<div class="cart-item-row"><strong>Total</strong><strong>$${items.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2)}</strong></div>`
            : '<p>No items in local storage pipeline.</p>';
    };
    
    render();

    document.getElementById('cartItemsContainer').addEventListener('click', e => {
        if (!e.target.classList.contains('qty-btn')) return;
        const id = parseInt(e.target.dataset.id);
        const delta = parseInt(e.target.dataset.delta);
        let cart = getCart();
        const match = cart.find(i => i.id === id);
        if (match) {
            match.qty += delta;
            if (match.qty <= 0) cart = cart.filter(i => i.id !== id);
        }
        saveCart(cart);
        updateCartBadge();
        render();
    });

    document.getElementById('clearCartBtn').addEventListener('click', () => {
        localStorage.removeItem('cart');
        render();
        updateCartBadge();
    });

    document.getElementById('validatedForm').addEventListener('submit', e => {
        e.preventDefault();
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
}
