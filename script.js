// DOM要素の取得
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const searchButton = document.getElementById('searchButton');
const resetButton = document.getElementById('resetButton');
const results = document.getElementById('results');
const noResults = document.getElementById('noResults');
const resultCount = document.getElementById('resultCount');

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeCategorySelect();
    displayAllResults();
    bindEvents();
});

// カテゴリセレクトボックスの初期化
function initializeCategorySelect() {
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// イベントリスナーの設定
function bindEvents() {
    searchButton.addEventListener('click', performSearch);
    resetButton.addEventListener('click', resetSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    categorySelect.addEventListener('change', performSearch);
    searchInput.addEventListener('input', debounce(performSearch, 300));
}

// デバウンス関数（入力中の連続実行を防ぐ）
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 検索実行
function performSearch() {
    const keyword = searchInput.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value;
    
    let filteredData = fairplayData;
    
    // カテゴリフィルタ
    if (selectedCategory) {
        filteredData = filteredData.filter(item => item.category === selectedCategory);
    }
    
    // キーワード検索（条文とFAQの両方を検索対象とする）
    if (keyword) {
        filteredData = filteredData.filter(item => 
            item.rule.toLowerCase().includes(keyword) ||
            item.faq.toLowerCase().includes(keyword) ||
            item.category.toLowerCase().includes(keyword)
        );
    }
    
    displayResults(filteredData);
}

// 検索リセット
function resetSearch() {
    searchInput.value = '';
    categorySelect.value = '';
    displayAllResults();
}

// 全件表示
function displayAllResults() {
    displayResults(fairplayData);
}

// 検索結果の表示
function displayResults(data) {
    if (data.length === 0) {
        showNoResults();
        return;
    }
    
    showResultCount(data.length);
    
    results.innerHTML = '';
    results.style.display = 'block';
    noResults.style.display = 'none';
    
    data.forEach(item => {
        const card = createResultCard(item);
        results.appendChild(card);
    });
    
    // スクロール位置を結果の先頭に移動（モバイルでの利便性向上）
    if (window.innerWidth <= 768 && data.length > 0) {
        results.scrollIntoView({ behavior: 'smooth' });
    }
}

// 検索結果なしの表示
function showNoResults() {
    results.style.display = 'none';
    noResults.style.display = 'block';
    resultCount.style.display = 'none';
}

// 検索結果件数の表示
function showResultCount(count) {
    resultCount.textContent = `${count}件の規定が見つかりました`;
    resultCount.style.display = 'block';
}

// 結果カードの作成
function createResultCard(item) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    // キーワードハイライト機能
    const keyword = searchInput.value.trim();
    const highlightedRule = highlightText(item.rule, keyword);
    const highlightedFaq = highlightText(item.faq, keyword);
    
    card.innerHTML = `
        <div class="card-header">
            <h5 class="mb-0">規定 ${item.id}</h5>
            <span class="category-badge">${item.category}</span>
        </div>
        <div class="card-body">
            <div class="rule-section">
                <div class="section-title">
                    <i class="fas fa-book text-primary"></i>
                    条文
                </div>
                <div class="rule-text">${highlightedRule}</div>
            </div>
            <div class="faq-section">
                <div class="section-title">
                    <i class="fas fa-question-circle text-success"></i>
                    FAQ
                </div>
                <div class="faq-text">${highlightedFaq}</div>
            </div>
        </div>
    `;
    
    return card;
}

// テキストハイライト機能
function highlightText(text, keyword) {
    if (!keyword) return text;
    
    const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
    return text.replace(regex, '<mark style="background-color: #ffeb3b; padding: 0.1em 0.2em; border-radius: 3px;">$1</mark>');
}

// 正規表現用エスケープ
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// スムーズスクロール機能（検索結果への移動）
function scrollToResults() {
    if (results.children.length > 0) {
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('エラーが発生しました:', e.error);
    // ユーザーに見やすいエラーメッセージを表示
    if (results) {
        results.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">エラーが発生しました</h4>
                <p>申し訳ございませんが、検索機能でエラーが発生しました。ページを再読み込みしてお試しください。</p>
            </div>
        `;
    }
});

// パフォーマンス最適化：大量データ対応（将来的な拡張に備えて）
function optimizeForLargeDataset(data) {
    // 1000件以上のデータの場合は仮想スクロールなどを実装
    if (data.length > 1000) {
        console.warn('大量のデータが検出されました。パフォーマンス最適化が推奨されます。');
    }
    return data;
}

// モバイル対応：タッチイベントの最適化
if ('ontouchstart' in window) {
    // タッチデバイスの場合の最適化処理
    document.body.classList.add('touch-device');
}
