// Кастомные модальные окна BatonCHIK Games v6.0
const Modal = {
    show(title, message, buttonText = 'OK') {
        // Удаляем старое окно, если есть
        const old = document.getElementById('custom-modal');
        if (old) old.remove();
        
        const modal = document.createElement('div');
        modal.id = 'custom-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;';
        modal.innerHTML = `
            <div style="background:#16213e;color:#fff;border-radius:16px;padding:24px;max-width:320px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.5);">
                <div style="font-size:20px;font-weight:bold;margin-bottom:10px;">${title}</div>
                <div style="font-size:15px;color:#b0b0b0;margin-bottom:20px;">${message}</div>
                <button id="modal-ok-btn" style="padding:12px 32px;background:#e94560;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:bold;cursor:pointer;">${buttonText}</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        return new Promise(resolve => {
            document.getElementById('modal-ok-btn').addEventListener('click', () => {
                modal.remove();
                resolve();
            });
        });
    }
};
