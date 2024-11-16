# 元素宽高比固定
HTML:
```html
<div class="container">
    <div class="item"></div>
</div>
```

## 2017年前
padding百分比是相对于父元素的宽

CSS:
```css
.contian{
    width: 20%;
}
.item{
    width: 100%;
    padding: 50% 0;
    background-color: blanchedalmond;
}
```

## 2021年前
aspect-ratio固定元素的宽高比 

CSS:
```css
.contian{
    width: 20%;
}
.item{
    width: 100%;
    aspect-ratio: 1/1;
    background-color: blanchedalmond;
}
```

## 现在（2024年）
cqw是父元素宽度的1%的单位，需要设置父元素为 inline-size

CSS:
```css
.contian{
    width: 20%;
    container-type: inline-size;
}
.item{
    width: 100cqw;
    height: 100cqw;
    background-color: blanchedalmond;
}
```
