export function tip(text, x, y, color, dur, size) {
  if (!size) {
    size = 100;
  }
  if (!dur) dur = 5;
  return { text, x, y, color, size, dur };
}

export function findGetParameter(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return "";

  try {
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  } catch (e) {
    return null; // или можно вернуть оригинальное значение, если это приемлемо
  }
}

export function getDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;

  if (/mobi|android|iphone|ipad|ipod|blackberry|phone/i.test(userAgent)) {
    if (width < 768) {
      return "phone";
    } else {
      return "tablet";
    }
  } else {
    return "desktop";
  }
}
