window.lightningjs ||
  (function (n) {
    var e = 'lightningjs';
    function t(e, t) {
      var r, i, a, o, d, c;
      return (
        t && (t += (/\?/.test(t) ? '&' : '?') + 'lv=1'),
        n[e] ||
          ((r = window),
          (i = document),
          (a = e),
          (o = i.location.protocol),
          (d = 'load'),
          (c = 0),
          (function () {
            n[a] = function () {
              var t = arguments,
                i = this,
                o = ++c,
                d = (i && i != r && i.id) || 0;
              function s() {
                return (s.id = o), n[a].apply(s, arguments);
              }
              return (
                (e.s = e.s || []).push([o, d, t]),
                (s.then = function (n, t, r) {
                  var i = (e.fh[o] = e.fh[o] || []),
                    a = (e.eh[o] = e.eh[o] || []),
                    d = (e.ph[o] = e.ph[o] || []);
                  return n && i.push(n), t && a.push(t), r && d.push(r), s;
                }),
                s
              );
            };
            var e = (n[a]._ = {});
            function s() {
              e.P(d), (e.w = 1), n[a]('_load');
            }
            (e.fh = {}),
              (e.eh = {}),
              (e.ph = {}),
              (e.l = t ? t.replace(/^\/\//, ('https:' == o ? o : 'http:') + '//') : t),
              (e.p = { 0: +new Date() }),
              (e.P = function (n) {
                e.p[n] = new Date() - e.p[0];
              }),
              e.w && s(),
              r.addEventListener ? r.addEventListener(d, s, !1) : r.attachEvent('onload', s);
            var l = function () {
              var d = i['body'];
              if (!d) return setTimeout(l, 100);
              e.P(1);
              var c,
                s = i.createElement('div'),
                h = s.appendChild(i.createElement('div')),
                u = i.createElement('iframe');
              (s.style.display = 'none'),
                (d.insertBefore(s, d.firstChild).id = 'lightningjs-' + a),
                (u.frameBorder = '0'),
                (u.id = 'lightningjs-frame-' + a),
                (u.allowTransparency = 'true'),
                h.appendChild(u);
              try {
                u.contentWindow.document.open();
              } catch (n) {
                console.error('Embedding Usabilla failed', n);
              }
              var fs = document.createElement('script');
              fs.src = e.l;
              try {
                var p = u.contentWindow.document;
                p.write('<!DOCTYPE html><html><head></head><body></body></html>');
                p.body.appendChild(fs);
                p.close();
              } catch (e) {
                console.error('Embedding Usabilla failed', e);
              }
              e.P(2);
            };
            e.l && l();
          })()),
        (n[e].lv = '1'),
        n[e]
      );
    }
    var r = (window.lightningjs = t(e));
    (r.require = t), (r.modules = n);
  })({});

function setupUsabilla(usabillaId) {
  window.usabilla_live = lightningjs.require('usabilla_live', '//w.usabilla.com/' + usabillaId + '.js');

  window.usabilla_live('setEventCallback', function (category, action, label, value, userData) {
    dataLayer.push({
      event: 'usabilla.callback',
      usabilla: {
        category: category,
        action: action,
        label: label,
        value: value,
        userData: userData,
      },
    });

    const header = document.querySelector('cara-header');

    if (action === 'Feedback:Open' && !!header) {
      header.style.position = 'relative';

      setTimeout(function () {
        header.style.position = '';
      }, 1200);
    }
  });
}

window.usabillaIdsForTenant = window.usabillaIdsForTenant || { mobileId: false, desktopId: false };

function injectUsabilla() {
  const ids = window.usabillaIdsForTenant;

  if (!ids.mobileId) {
    console.error('window.usabillaIdsForTenant.mobileId must be specified to load usabilla.');
  }

  if (!ids.desktopId) {
    console.error('window.usabillaIdsForTenant.desktopId must be specified to load usabilla.');
  }

  const width = document.body.clientWidth;
  const usabillaId = width < 768 ? ids.mobileId : ids.desktopId;

  if (usabillaId == null) {
    throw new Error(`Usabilla not loaded, ${width < 768 ? 'mobileId' : 'desktopId'} is missing.`);
  }

  setupUsabilla(usabillaId);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  injectUsabilla();
} else {
  const oldWindowload = window.onload;
  window.onload = function () {
    if (oldWindowload) {
      oldWindowload();
    }
    // We are also checking the localStorage-value because the window value might be set to late.
    injectUsabilla();
  };
}
