// Викторина
let quizCorrect = 0, quizTotal = 0, quizAnswered = false, currentQuestion = null;

function initQuiz() {
    const html = `
        <div class="container">
            <button class="back-btn" onclick="showMain()">← Назад</button>
            <h2>🧠 ИИ-Викторина</h2>
            <div class="settings">
                <select id="topicSelect">
                    <option value="общие знания">🌍 Общие знания</option>
                    <option value="история">📜 История</option>
                    <option value="наука">🔬 Наука</option>
                    <option value="кино">🎬 Кино</option>
                    <option value="география">🗺 География</option>
                    <option value="спорт">⚽ Спорт</option>
                </select>
                <select id="difficultySelect">
                    <option value="Лёгкий">💚 Лёгкий</option>
                    <option value="Средний">🧡 Средний</option>
                    <option value="Сложный">❤️ Сложный</option>
                </select>
                <button class="btn" id="newQuestionBtn">🎲 Новый вопрос</button>
            </div>
            <div class="quiz-card" id="quizCard" style="display:none;">
                <div class="difficulty-badge" id="difficultyBadge"></div>
                <div class="question-text" id="questionText"></div>
                <div class="options-grid" id="optionsGrid"></div>
                <div class="feedback" id="feedback"></div>
            </div>
            <div class="stats" id="stats">Правильных: 0 | Всего: 0</div>
        </div>
    `;
    const el = loadGameHTML('quizScreen', html);
    if (el._init) return;
    el._init = true;

    document.getElementById('newQuestionBtn').addEventListener('click', getAIQuestion);
}

async function getAIQuestion() {
    const topic = document.getElementById('topicSelect').value;
    const difficulty = document.getElementById('difficultySelect').value;
    const btn = document.getElementById('newQuestionBtn');
    const card = document.getElementById('quizCard');
    btn.disabled = true; btn.textContent = '⏳ Генерация...'; card.style.display = 'block';
    document.getElementById('questionText').textContent = 'Нейросеть думает...';
    document.getElementById('optionsGrid').innerHTML = '';
    document.getElementById('feedback').textContent = '';
    quizAnswered = false;
    let retries = 0;
    while (retries < 3) {
        try {
            const resp = await fetch('https://text.pollinations.ai/openai', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'openai', messages: [{ role: 'user', content: `Придумай новый уникальный вопрос для викторины на русском языке. Тема: "${topic}". Сложность: "${difficulty}". Ответ — строго валидный JSON: {"question":"вопрос","options":["a","b","c","d"],"correctIndex":0}.` }], temperature: 1.2 })
            });
            const data = await resp.json();
            const raw = data.choices[0].message.content.trim();
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (!jsonMatch) { retries++; continue; }
            const q = JSON.parse(jsonMatch[0]);
            if (!q.question || !q.options || q.options.length !== 4 || typeof q.correctIndex !== 'number') { retries++; continue; }
            currentQuestion = q;
            document.getElementById('questionText').textContent = q.question;
            document.getElementById('difficultyBadge').textContent = difficulty;
            document.getElementById('difficultyBadge').className = `difficulty-badge difficulty-${difficulty}`;
            document.getElementById('optionsGrid').innerHTML = q.options.map((o, i) => `<button class="option-btn" data-index="${i}">${o}</button>`).join('');
            document.querySelectorAll('.option-btn').forEach(b => b.addEventListener('click', function() { checkQuiz(parseInt(this.dataset.index), this); }));
            btn.disabled = false; btn.textContent = '🎲 Новый вопрос';
            return;
        } catch (e) { retries++; }
    }
    document.getElementById('questionText').textContent = '😵 Не удалось. Попробуй ещё раз.';
    btn.disabled = false; btn.textContent = '🎲 Новый вопрос';
}

function checkQuiz(index, btn) {
    if (quizAnswered || !currentQuestion) return;
    quizAnswered = true; quizTotal++;
    const all = document.querySelectorAll('#optionsGrid .option-btn');
    all.forEach(b => b.disabled = true);
    if (index === currentQuestion.correctIndex) { btn.classList.add('correct'); document.getElementById('feedback').textContent = '✅ Правильно!'; quizCorrect++; addXP(10); }
    else { btn.classList.add('wrong'); all[currentQuestion.correctIndex].classList.add('correct'); document.getElementById('feedback').textContent = '❌ Неправильно!'; }
    document.getElementById('stats').textContent = `Правильных: ${quizCorrect} | Всего: ${quizTotal}`;
}

document.getElementById('btnQuiz').addEventListener('click', () => {
    showOnly('quizScreen');
    initQuiz();
    getAIQuestion();
});
