function findGetParameter(name, url) {
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

const isAdjacent = (x1, y1, x2, y2) => {
  // Проверяем, являются ли все аргументы целыми числами
  if (![x1, y1, x2, y2].every(Number.isInteger)) {
    return false;
  }

  // Проверяем ортогональную смежность
  return (x1 === x2 && Math.abs(y1 - y2) === 1) || (y1 === y2 && Math.abs(x1 - x2) === 1);
};

function getDeviceType() {
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
