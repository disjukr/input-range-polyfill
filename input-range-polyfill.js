(function () {
    function dontNeedPolyfill() {
        var check = document.createElement('input');
        check.setAttribute('type', 'range');
        return check.type != 'text';
    }
    if (dontNeedPolyfill())
        return;
    var change = document.createEvent('UIEvents');
    change.initUIEvent('change', true, false, window, 1);
    function createAlternative(target) {
        var alt = document.createElement('div');
        var slider = document.createElement('div');
        var bar = document.createElement('div');
        var thumb = document.createElement('div');
        var text = document.createElement('div');
        var min, max, step, value;
        var pos = 0;
        alt.className = 'input-range';
        alt.appendChild(slider);
        alt.appendChild(text);
        alt.addEventListener('mousedown', mousedown);
        slider.className = 'input-range-slider';
        slider.appendChild(bar);
        slider.appendChild(thumb);
        bar.className = 'input-range-bar';
        thumb.className = 'input-range-thumb';
        thumb.addEventListener('mousedown', thumb_mousedown);
        text.style.setProperty('font-size', '0px');
        text.textContent = 'slider';
        function slide(clientX) {
            setThumbX(relativeX(clientX) - pos - getThumbWidth() * 0.5);
            updateValue();
            updatePosition();
            target.dispatchEvent(change);
        }
        function mousedown(e) {
            slide(e.clientX);
            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseup);
        }
        function thumb_mousedown(e) {
            pos = relativeX(e.clientX) - getThumbX() - getThumbWidth() * 0.5;
        }
        function mousemove(e) {
            slide(e.clientX);
        }
        function mouseup(e) {
            slide(e.clientX);
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            pos = 0;
        }
        function relativeX(absoluteX) {
            var rect = bar.getBoundingClientRect();
            return absoluteX - rect.left;
        }
        function getBarWidth() {
            return bar.offsetWidth;
        }
        function getThumbWidth() {
            return thumb.offsetWidth;
        }
        function getScrollWidth() {
            return getBarWidth() - getThumbWidth();
        }
        function getThumbX() {
            return parseFloat(thumb.style.marginLeft);
        }
        function setThumbX(val) {
            if (getScrollWidth() == 0 || isNaN(val))
                return;
            val = Math.max(0, Math.min(val, getScrollWidth()));
            val = (val === 0) ? '0' : val + 'px';
            thumb.style.setProperty('margin-left', val);
        }
        function calculateValue(val) {
            if (val == null || val === '' || isNaN(val))
                val = (min + max) * 0.5;
            var value = Math.min(max, Math.max(min, parseFloat(val)));
            if (step === 0)
                return value;
            else
                return value - (value % step);
        }
        function updatePosition() {
            var normValue = (value - min) / max;
            setThumbX(getScrollWidth() * normValue);
        }
        function updateValue() {
            var normPosition = getThumbX() / getScrollWidth();
            if (isNaN(normPosition))
                return;
            value = calculateValue(normPosition * (max - min) + min);
            target.value = value;
        }
        function update() {
            alt.setAttribute('style', target.getAttribute('style'));
            alt.style.setProperty('display', '');
            if (target.min == null || target.min === '')
                min = 0;
            else
                min = parseFloat(target.min);
            if (target.max == null || target.max === '')
                max = 100;
            else
                max = parseFloat(target.max);
            if (target.step == null || target.step === '')
                step = 1;
            else
                step = parseFloat(target.step);
            target.value = value = calculateValue(target.value);
            updatePosition();
            updateValue();
        }
        update();
        setInterval(update, 100);
        return alt;
    }
    var targets = document.querySelectorAll('input[type="range"]');
    for (var i = 0; i < targets.length; ++i) {
        var target = targets[i];
        var alt = createAlternative(target);
        target.parentElement.insertBefore(alt, target);
        target.style.setProperty('display', 'none');
    }
})();