// フェアプレイ規定データ
const data = [
{
id: “第1条”,
title: “遅延行為の禁止”,
text: “意図的な遅延行為は禁止する。プレイヤーは制限時間内に適切な判断を行い、ゲームの進行を妨げてはならない。”,
category: [“遅延行為”, “進行妨害”],
faq: [“どこまでが遅延行為？”, “無操作も含まれますか？”, “ネットワーク遅延は対象外ですか？”]
},
{
id: “第2条”,
title: “機材トラブルの報告義務”,
text: “使用機材に問題が発生した場合は速やかに運営に報告すること。機材の不調を理由とした有利な状況の作出は禁止する。”,
category: [“機材トラブル”, “報告義務”],
faq: [“どのタイミングで報告すべきですか？”, “軽微なトラブルも報告が必要ですか？”]
},
{
id: “第3条”,
title: “不正ツールの使用禁止”,
text: “ゲームに影響を与える外部ツール、マクロ、自動化プログラムの使用を禁止する。正当な支援技術を除き、プレイヤー自身の操作によってゲームを進行させること。”,
category: [“不正ツール”, “外部プログラム”],
faq: [“支援技術とは何ですか？”, “設定変更は問題ありませんか？”]
},
{
id: “第4条”,
title: “スポーツマンシップの遵守”,
text: “対戦相手や運営スタッフに対して敬意を払い、フェアプレイ精神を重んじること。暴言、嫌がらせ、威圧的な行為は禁止する。”,
category: [“スポーツマンシップ”, “マナー”],
faq: [“どの程度の発言が問題となりますか？”, “対戦後の感想戦は問題ありませんか？”]
},
{
id: “第5条”,
title: “情報の共有・漏洩禁止”,
text: “大会中に得た内部情報や他プレイヤーの戦略情報を無断で第三者に共有することを禁止する。公開情報の範囲を超える情報の取り扱いには注意すること。”,
category: [“情報管理”, “機密保持”],
faq: [“どこまでが公開情報ですか？”, “SNSでの発言は制限されますか？”]
}
];

// DOM要素の取得
const searchInput = document.getElementById(‘searchInput’);
const categorySelect = document.getElementById(‘categorySelect’);
const clearButton = document.getElementById(‘clearButton’);
const clearCategoryButton = document.getElementById(‘clearCategoryButton’);
const resultsContainer = document.getElementById(‘resultsContainer’);
const resultsCount = document.getElementById(‘resultsCount’);
const noResults = document.getElementById(‘noResults’);

// 初期化
document.addEventListener(‘DOMContentLoaded’, function() {
initializeCategoryOptions();
displayAllResults();
setupEventListeners();
});

// カテゴリ選択肢の初期化
function initializeCategoryOptions() {
const categories = new Set();
data.forEach(item => {
item.category.forEach(cat => categories.add(cat));
});

```
// ソートしてオプションを追加
const sortedCategories = Array.from(categories).sort();
sortedCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
});
```

}

// イベントリスナーの設定
function setupEventListeners() {
searchInput.addEventListener(‘input’, performSearch);
categorySelect.addEventListener(‘change’, performSearch);
clearButton.addEventListener(‘click’, clearSearch);
clearCategoryButton.addEventListener(‘click’, clearCategory);

```
// Enterキーでの検索
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});
```

}

// 検索実行
function performSearch() {
const keyword = searchInput.value.trim().toLowerCase();
const selectedCategories = Array.from(categorySelect.selectedOptions).map(option => option.value).filter(val => val !== ‘’);

```
let filteredData = data;

// カテゴリフィルタ
if (selectedCategories.length > 0) {
    filteredData = filteredData.filter(item => 
        selectedCategories.some(category => item.category.includes(category))
    );
}

// キーワード検索
if (keyword) {
    filteredData = filteredData.filter(item => 
        item.title.toLowerCase().includes(keyword) || 
        item.text.toLowerCase().includes(keyword) ||
        item.faq.some(faq => faq.toLowerCase().includes(keyword))
    );
}

displayResults(filteredData, keyword);
```

}

// 結果表示
function displayResults(results, keyword = ‘’) {
if (results.length === 0) {
resultsContainer.style.display = ‘none’;
noResults.style.display = ‘block’;
resultsCount.textContent = ‘’;
return;
}

```
resultsContainer.style.display = 'block';
noResults.style.display = 'none';
resultsCount.textContent = `${results.length}件の規定が見つかりました`;

resultsContainer.innerHTML = results.map(item => createResultHTML(item, keyword)).join('');
```

}

// 個別結果のHTML生成
function createResultHTML(item, keyword) {
const highlightedTitle = highlightKeyword(item.title, keyword);
const highlightedText = highlightKeyword(item.text, keyword);
const highlightedFAQs = item.faq.map(faq => highlightKeyword(faq, keyword));

```
const categoriesHTML = item.category.map(cat => 
    `<span class="category-badge">${cat}</span>`
).join('');

const faqHTML = item.faq.length > 0 ? `
    <div class="faq-section">
        <h4>よくある質問</h4>
        <ul class="faq-list">
            ${highlightedFAQs.map(faq => `<li>${faq}</li>`).join('')}
        </ul>
    </div>
` : '';

return `
    <div class="result-item">
        <div class="result-header">
            <h3 class="result-id">${item.id}</h3>
            <h3 class="result-title">${highlightedTitle}</h3>
        </div>
        <div class="result-categories">
            ${categoriesHTML}
        </div>
        <div class="result-text">
            ${highlightedText}
        </div>
        ${faqHTML}
    </div>
`;
```

}

// キーワードハイライト
function highlightKeyword(text, keyword) {
if (!keyword) return text;

```
const regex = new RegExp(`(${escaperegex(keyword)})`, 'gi');
return text.replace(regex, '<mark class="highlight">$1</mark>');
```

}

// 正規表現エスケープ
function escapeRegex(string) {
return string.replace(/[.*+?^${}()|[]\]/g, ‘\$&’);
}

// 検索クリア
function clearSearch() {
searchInput.value = ‘’;
performSearch();
}

// カテゴリクリア
function clearCategory() {
categorySelect.selectedIndex = -1;
// 「すべてのカテゴリ」オプションを選択状態にする
categorySelect.options[0].selected = true;
performSearch();
}

// 全結果表示（初期表示用）
function displayAllResults() {
displayResults(data);
}
