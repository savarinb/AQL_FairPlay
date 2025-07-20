// フェアプレイ規定データ
const data = [
    {
        id: "第1条",
        title: "遅延行為の禁止",
        text: "競技において意図的な遅延行為は禁止する。これには無操作による時間稼ぎ、不要な思考時間の延長、故意の機材トラブル申告等が含まれる。",
        category: ["遅延行為", "進行妨害"],
        faq: ["どこまでが遅延行為に該当しますか？", "無操作による時間経過も含まれますか？", "思考時間の制限はありますか？"]
    },
    {
        id: "第2条",
        title: "機材トラブルの報告義務",
        text: "使用機材に問題が発生した場合は速やかに運営スタッフに報告すること。虚偽の報告や故意の機材破損は厳重に処罰される。",
        category: ["機材トラブル", "報告義務"],
        faq: ["どの程度の不具合で報告すべきですか？", "機材の交換は可能ですか？"]
    },
    {
        id: "第3条",
        title: "対戦相手への敬意",
        text: "全ての参加者は対戦相手に対して敬意を払い、スポーツマンシップに則った行動を取ること。暴言、煽り行為、威嚇行為は一切禁止する。",
        category: ["スポーツマンシップ", "対戦マナー"],
        faq: ["どのような発言が暴言に該当しますか？", "対戦後の握手は必須ですか？", "SNSでの発言も対象になりますか？"]
    }
];

let allCategories = [];
let filteredData = [...data];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // カテゴリ一覧を生成
    generateCategories();
    // 初期表示（全件表示）
    displayResults(data);
    // イベントリスナーを設定
    setupEventListeners();
}

function generateCategories() {
    const categorySet = new Set();
    data.forEach(item => {
        item.category.forEach(cat => categorySet.add(cat));
    });
    allCategories = [...categorySet].sort();
    
    const categorySelect = document.getElementById('categorySelect');
    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const searchButton = document.getElementById('searchButton');

    // リアルタイム検索
    searchInput.addEventListener('input', performSearch);
    categorySelect.addEventListener('change', performSearch);
    searchButton.addEventListener('click', performSearch);

    // Enterキーでの検索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    const selectedCategories = Array.from(document.getElementById('categorySelect').selectedOptions)
        .map(option => option.value)
        .filter(value => value !== '');

    filteredData = data.filter(item => {
        // キーワード検索
        const keywordMatch = keyword === '' || 
            item.title.toLowerCase().includes(keyword) || 
            item.text.toLowerCase().includes(keyword);

        // カテゴリ検索
        const categoryMatch = selectedCategories.length === 0 || 
            selectedCategories.some(cat => item.category.includes(cat));

        return keywordMatch && categoryMatch;
    });

    displayResults(filteredData, keyword);
}

function displayResults(results, keyword = '') {
    const resultsInfo = document.getElementById('resultsInfo');
    const resultsContainer = document.getElementById('resultsContainer');

    // 結果件数の表示
    resultsInfo.textContent = `${results.length}件の規定が見つかりました`;

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">該当する規定が見つかりませんでした</div>';
        return;
    }

    // 結果の表示
    resultsContainer.innerHTML = results.map(item => {
        const highlightedTitle = highlightText(item.title, keyword);
        const highlightedText = highlightText(item.text, keyword);
        
        const categoriesHtml = item.category.map(cat => 
            `<span class="category-tag">${cat}</span>`
        ).join('');

        const faqHtml = item.faq.length > 0 ? `
            <div class="faq-section">
                <div class="faq-title">よくある質問</div>
                ${item.faq.map(faq => `<div class="faq-item">${faq}</div>`).join('')}
            </div>
        ` : '';

        return `
            <div class="rule-card">
                <div class="rule-header">
                    <div class="rule-id">${item.id}</div>
                    <div class="rule-title">${highlightedTitle}</div>
                </div>
                <div class="rule-text">${highlightedText}</div>
                <div class="categories">${categoriesHtml}</div>
                ${faqHtml}
            </div>
        `;
    }).join('');
}

function highlightText(text, keyword) {
    if (!keyword) return text;
    
    const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
