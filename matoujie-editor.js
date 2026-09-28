/**
 * Matoujie Editor Plugin（轻量版，仅编辑器内生效）
 *
 * 为 Typora 编辑器的代码块提供两个功能（替代 obgnail/typora_plugin 全家桶）：
 *   1. 一键复制 — 悬停代码块，右上角出现复制按钮
 *   2. 长代码折叠 — 超过 foldLines 行的代码块默认折叠
 *
 * 安装：本文件放入 Typora resources/ 目录，window.html 注入
 *   <script src="./matoujie-editor.js" defer="defer"></script>
 * 依赖主题 CSS 中的 .mj-code-copy / mj-folded 样式（matoujie.css）。
 */
(function () {
  'use strict';

  var CONFIG = {
    foldLines: 20 // 超过该行数的代码块可折叠
  };

  function lineText(pre) {
    var lines = pre.querySelectorAll('.CodeMirror-line');
    if (lines.length) {
      var arr = [];
      Array.prototype.forEach.call(lines, function (l) { arr.push(l.textContent); });
      return arr.join('\n');
    }
    return pre.textContent;
  }

  function copyText(text, btn) {
    var done = function (ok) {
      btn.textContent = ok ? '✓ 已复制' : '✗ 失败';
      setTimeout(function () { btn.textContent = '复制'; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallback(text)); });
    } else {
      done(fallback(text));
    }
  }

  function fallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    ta.remove();
    return ok;
  }

  function enhance(pre) {
    if (pre.querySelector('.mj-editor-tools')) return;

    // 按钮容器：右上角悬浮，悬停显示
    var tools = document.createElement('div');
    tools.className = 'mj-editor-tools';

    var copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'mj-code-copy';
    copy.textContent = '复制';
    // 阻止事件进入 CodeMirror，避免点击按钮时光标跳动
    copy.addEventListener('mousedown', function (e) { e.preventDefault(); e.stopPropagation(); });
    copy.addEventListener('click', function (e) {
      e.stopPropagation();
      copyText(lineText(pre), copy);
    });
    tools.appendChild(copy);

    var lines = lineText(pre).split('\n').length;
    if (lines > CONFIG.foldLines) {
      var tog = document.createElement('button');
      tog.type = 'button';
      tog.className = 'mj-code-fold';
      tog.textContent = '折叠 ▴';
      tog.addEventListener('mousedown', function (e) { e.preventDefault(); e.stopPropagation(); });
      tog.addEventListener('click', function (e) {
        e.stopPropagation();
        var folded = pre.classList.toggle('mj-folded');
        tog.textContent = folded ? '展开 ' + lines + ' 行 ▾' : '折叠 ▴';
      });
      if (!pre.classList.contains('mj-folded')) pre.classList.add('mj-folded'); // 默认折叠
      tog.textContent = '展开 ' + lines + ' 行 ▾';
      tools.appendChild(tog);
    }

    pre.appendChild(tools);
    pre.classList.add('mj-has-tools');
  }

  var timer = null;
  function scheduleScan() {
    if (timer) return;
    timer = setTimeout(function () {
      timer = null;
      try {
        Array.prototype.forEach.call(
          document.querySelectorAll('#write pre.md-fences'),
          enhance
        );
      } catch (e) {}
    }, 300);
  }

  function boot() {
    scheduleScan();
    // 编辑器动态增删代码块 / 切换文档时重新扫描
    var observer = new MutationObserver(scheduleScan);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
