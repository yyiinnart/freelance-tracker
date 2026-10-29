/* Theme controls use the single early-loaded FTTheme preference. */
document.addEventListener('DOMContentLoaded', function () {
  var choices = document.querySelectorAll('#editorial-theme-options input[type=radio]');
  var status = document.getElementById('editorial-theme-status');
  var labels = {original:'柔霧深藍',dark:'炭灰深色',light:'紙白淺色'};
  function sync(message) {
    var theme = window.FTTheme ? FTTheme.get() : document.documentElement.dataset.editorialTheme;
    choices.forEach(function (choice) { choice.checked = choice.value === theme; });
    status.textContent = '目前使用：' + labels[theme] + (message ? ' · ' + message : '');
  }
  sync();
  choices.forEach(function (choice) {
    choice.addEventListener('change', function () {
      if (!choice.checked) return;
      var saved = window.FTTheme && FTTheme.set(choice.value);
      sync(saved ? '已儲存' : '無法儲存，僅本次有效；請檢查瀏覽器的儲存權限。');
    });
  });
  document.addEventListener('ft-theme-change', function () { sync(); });
  document.addEventListener('ft-theme-storage', function () { sync(); });
  // Capture the existing category hue for contrast-adjusted visual borders only.
  function tintLabels() {
    document.querySelectorAll('#v-proj .badge[style]').forEach(function (badge) {
      if (badge.style.color) badge.style.setProperty('--tag-hue', badge.style.color);
    });
    document.querySelectorAll('#v-proj .proj-table td:nth-child(3) span[style]').forEach(function (dot) {
      if (!dot.style.backgroundColor || !dot.classList.contains('rounded-full')) return;
      var tag = dot.parentElement;
      tag.classList.add('editorial-custom-tag');
      tag.style.setProperty('--tag-hue', dot.style.backgroundColor);
    });
  }
  tintLabels();
  new MutationObserver(tintLabels).observe(document.getElementById('v-proj'), {childList:true, subtree:true});
});

/* Presentation-only adapter for legacy inline styles and Chart.js canvas labels.
   Never reads or writes task objects, settings, or browser storage. */
(function(){
  var neutralPaints={"100-116-139-1000-ink":"--paint-100-116-139-1000-ink","203-213-225-1000-ink":"--paint-203-213-225-1000-ink","241-245-249-1000-ink":"--paint-241-245-249-1000-ink","148-163-184-1000-ink":"--paint-148-163-184-1000-ink","30-41-59-1000-fill":"--paint-30-41-59-1000-fill","51-65-85-1000-fill":"--paint-51-65-85-1000-fill","51-65-85-1000-line":"--paint-51-65-85-1000-line","100-116-139-1000-line":"--paint-100-116-139-1000-line","39-53-72-1000-fill":"--paint-39-53-72-1000-fill","71-85-105-1000-line":"--paint-71-85-105-1000-line","30-41-59-1000-line":"--paint-30-41-59-1000-line","26-35-50-1000-line":"--paint-26-35-50-1000-line","19-31-46-1000-fill":"--paint-19-31-46-1000-fill","23-32-50-1000-fill":"--paint-23-32-50-1000-fill","39-53-72-1000-line":"--paint-39-53-72-1000-line","26-35-50-1000-fill":"--paint-26-35-50-1000-fill","226-232-240-1000-ink":"--paint-226-232-240-1000-ink","15-23-42-1000-fill":"--paint-15-23-42-1000-fill","8-15-26-1000-fill":"--paint-8-15-26-1000-fill","26-37-64-1000-line":"--paint-26-37-64-1000-line","12-21-37-1000-fill":"--paint-12-21-37-1000-fill","71-85-105-1000-ink":"--paint-71-85-105-1000-ink","26-37-64-1000-fill":"--paint-26-37-64-1000-fill","17-28-45-1000-fill":"--paint-17-28-45-1000-fill","30-45-66-1000-line":"--paint-30-45-66-1000-line","26-38-64-1000-fill":"--paint-26-38-64-1000-fill","143-163-189-1000-ink":"--paint-143-163-189-1000-ink","43-58-85-1000-ink":"--paint-43-58-85-1000-ink","11-21-36-1000-fill":"--paint-11-21-36-1000-fill","38-64-95-1000-line":"--paint-38-64-95-1000-line","5-8-13-1000-fill":"--paint-5-8-13-1000-fill","30-41-59-1000-ink":"--paint-30-41-59-1000-ink","3-5-8-1000-fill":"--paint-3-5-8-1000-fill","13-21-38-1000-fill":"--paint-13-21-38-1000-fill","30-41-59-350-fill":"--paint-30-41-59-350-fill","51-65-85-1000-ink":"--paint-51-65-85-1000-ink","19-29-46-1000-fill":"--paint-19-29-46-1000-fill","23-37-64-1000-fill":"--paint-23-37-64-1000-fill","15-21-32-1000-fill":"--paint-15-21-32-1000-fill","21-29-42-1000-line":"--paint-21-29-42-1000-line","10-15-24-1000-fill":"--paint-10-15-24-1000-fill","30-41-59-500-fill":"--paint-30-41-59-500-fill","51-65-85-600-fill":"--paint-51-65-85-600-fill","226-232-240-70-fill":"--paint-226-232-240-70-fill","226-232-240-40-fill":"--paint-226-232-240-40-fill","2-6-23-500-fill":"--paint-2-6-23-500-fill","20-29-44-1000-line":"--paint-20-29-44-1000-line","17-24-39-1000-fill":"--paint-17-24-39-1000-fill","30-41-59-450-fill":"--paint-30-41-59-450-fill","30-41-59-700-fill":"--paint-30-41-59-700-fill","30-41-59-800-line":"--paint-30-41-59-800-line","2-6-23-350-fill":"--paint-2-6-23-350-fill","248-250-252-1000-ink":"--paint-248-250-252-1000-ink","2-6-23-450-fill":"--paint-2-6-23-450-fill","226-232-240-1000-fill":"--paint-226-232-240-1000-fill","148-163-184-1000-line":"--paint-148-163-184-1000-line","30-41-59-900-line":"--paint-30-41-59-900-line","15-23-42-700-fill":"--paint-15-23-42-700-fill","71-85-105-1000-fill":"--paint-71-85-105-1000-fill","30-41-59-1000-shadow":"--paint-30-41-59-1000-shadow","15-23-42-400-fill":"--paint-15-23-42-400-fill","2-6-23-960-fill":"--paint-2-6-23-960-fill","148-163-184-220-shadow":"--paint-148-163-184-220-shadow","100-116-139-1000-fill":"--paint-100-116-139-1000-fill","2-6-23-880-fill":"--paint-2-6-23-880-fill","30-41-59-400-fill":"--paint-30-41-59-400-fill","51-65-85-500-line":"--paint-51-65-85-500-line","2-6-23-600-fill":"--paint-2-6-23-600-fill","2-6-23-780-fill":"--paint-2-6-23-780-fill","2-6-23-950-fill":"--paint-2-6-23-950-fill","30-41-59-900-fill":"--paint-30-41-59-900-fill","15-23-42-900-fill":"--paint-15-23-42-900-fill","15-23-42-600-fill":"--paint-15-23-42-600-fill","51-65-85-700-line":"--paint-51-65-85-700-line","11-18-32-1000-fill":"--paint-11-18-32-1000-fill","15-23-42-850-fill":"--paint-15-23-42-850-fill","2-6-23-850-fill":"--paint-2-6-23-850-fill","2-6-23-1000-fill":"--paint-2-6-23-1000-fill","15-23-42-800-fill":"--paint-15-23-42-800-fill","15-23-42-800-shadow":"--paint-15-23-42-800-shadow","23-32-50-960-fill":"--paint-23-32-50-960-fill"};
  function normalizeNode(el){
    if(!el.style||!el.hasAttribute('style'))return;
    ['color','background-color','border-color','border-top-color','border-bottom-color','border-left-color','border-right-color'].forEach(function(prop){
      var value=el.style.getPropertyValue(prop);
      var m=value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/);
      if(!m)return;
      var kind=prop==='color'?'ink':prop.indexOf('border')===0?'line':'fill';
      var key=[m[1],m[2],m[3],Math.round((m[4]===undefined?1:+m[4])*1000),kind].join('-');
      var paint=neutralPaints[key];
      if(paint)el.style.setProperty(prop,'var('+paint+')',el.style.getPropertyPriority(prop));
    });
  }
  function normalizeTree(el){if(el.nodeType!==1)return;normalizeNode(el);el.querySelectorAll('[style]').forEach(normalizeNode);}
  document.addEventListener('DOMContentLoaded',function(){
    normalizeTree(document.body);
    new MutationObserver(function(records){records.forEach(function(r){if(r.type==='attributes')normalizeNode(r.target);else r.addedNodes.forEach(normalizeTree);});}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
    if(!window.Chart)return;
    var datasetPaints=new WeakMap(), tickPaints=new WeakMap();
    Chart.register({id:'editorialCanvasTheme',beforeUpdate:function(chart){
      var c=getComputedStyle(document.documentElement),ink=c.getPropertyValue('--ed-text').trim(),muted=c.getPropertyValue('--ed-muted').trim(),rule=c.getPropertyValue('--ed-rule').trim();
      if(['c-week','c-month'].indexOf(chart.canvas.id)!==-1){
        chart.data.datasets.forEach(function(dataset){
          if(!datasetPaints.has(dataset))datasetPaints.set(dataset,{backgroundColor:dataset.backgroundColor,borderColor:dataset.borderColor});
          var original=datasetPaints.get(dataset), accent=c.getPropertyValue('--ed-accent').trim();
          function tint(v){if(Array.isArray(v))return v.map(tint);if(typeof v!=='string'||document.documentElement.dataset.editorialTheme==='original')return v;return /^(#(?:3b82f6|60a5fa|93c5fd|2563eb)|rgba?\(\s*(?:59,\s*130,\s*246|96,\s*165,\s*250))/i.test(v)?(v==='#3b82f6'?accent+'b3':accent):v;}
          dataset.backgroundColor=tint(original.backgroundColor);dataset.borderColor=tint(original.borderColor);
        });
      }
      var opts=chart.options;
      Object.keys(opts.scales||{}).forEach(function(k){var scale=opts.scales[k];if(scale.ticks){if(!tickPaints.has(scale.ticks))tickPaints.set(scale.ticks,scale.ticks.color);var originalTick=tickPaints.get(scale.ticks);scale.ticks.color=typeof originalTick==='function'?function(ctx){return originalTick(ctx)==='#475569'?muted+'aa':muted;}:muted;}if(scale.grid)scale.grid.color=rule;if(scale.border)scale.border.color=rule;});
      if(opts.plugins&&opts.plugins.legend&&opts.plugins.legend.labels)opts.plugins.legend.labels.color=ink;
      if(opts.plugins&&opts.plugins.title)opts.plugins.title.color=ink;
    }});
    document.addEventListener('ft-theme-change',function(){Object.values(Chart.instances||{}).forEach(function(chart){chart.update('none');});});
  });
})();
