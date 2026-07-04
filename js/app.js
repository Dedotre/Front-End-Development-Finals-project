const API_URL = 'https://fakestoreapi.com/products';

const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
const saveCart = (data) => localStorage.setItem('cart', JSON.stringify(data));

document.getElementById('hamburgerBtn')?.addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('active');
});

if (document.getElementById('productsContainer')) {
    (async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error();
            const products = await res.json();
            document.getElementById('loadingIndicator').remove();
            document.getElementById('productsContainer').innerHTML = products.map(p => `
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
        } catch {
            document.getElementById('loadingIndicator').textContent = "Failed loading data.";
        }
    })();

    document.getElementById('productsContainer').addEventListener('click', e => {
        if (e.target.classList.contains('add-cart')) {
            const cart = getCart();
            const id = parseInt(e.target.dataset.id);
            const match = cart.find(i => i.id === id);
            if (match) match.qty++; 
            else cart.push({ id, title: e.target.dataset.title, price: parseFloat(e.target.dataset.price), qty: 1 });
            saveCart(cart);
            
            const originalText = e.target.textContent;
            e.target.textContent = 'Added!';
            setTimeout(() => e.target.textContent = originalText, 1000);
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
                    <button id="addDetailBtn" class="btn btn-primary">Add to Local Cache</button>
                </div>
            `;
            document.getElementById('addDetailBtn').addEventListener('click', (e) => {
                const cart = getCart();
                const match = cart.find(i => i.id === p.id);
                if (match) match.qty++; else cart.push({ id: p.id, title: p.title, price: p.price, qty: 1 });
                saveCart(cart);
                
                const originalText = e.target.textContent;
                e.target.textContent = 'Added!';
                setTimeout(() => e.target.textContent = originalText, 1000);
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
            ? items.map(i => `<div class="cart-item-row"><div><strong>${i.title}</strong><br>Qty: ${i.qty}</div><span>$${(i.price * i.qty).toFixed(2)}</span></div>`).join('')
            : '<p>No items in local storage pipeline.</p>';
    };
    
    render();

    document.getElementById('clearCartBtn').addEventListener('click', () => {
        localStorage.removeItem('cart');
        render();
    });

    document.getElementById('validatedForm').addEventListener('submit', e => {
        e.preventDefault();
        document.getElementById('formSuccessMessage').classList.remove('hidden');
        e.target.reset();
    });
}
