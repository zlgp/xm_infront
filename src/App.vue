<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
body,
div,
p,
ul,
li,
a,
span,
input,
img,
i,
em,
h1,
h2,
h3,
h4,
h5,
h6,
strong,
del,
ins,
header,
nav,
footer {
  margin: 0;
  padding: 0;
}
body{
  background-color: #FAFAFA;
}
input {
  border: none;
  outline: none;
}
li {
  list-style: none;
}
img {
  border: none;
  vertical-align: middle;
}
a {
  text-decoration: none;
  color: black;
}
i {
  font-style: normal;
}
.clearfix::after {
  content: ".";
  clear: both;
  display: block;
  height: 0;
  visibility: hidden;
}
.clearfix {
  *zoom: 1;
}
::-webkit-scrollbar {
  display: none;
}
.area {
  max-width: 1200px;
  margin: 0 auto;
  /* text-align: center;
  overflow: hidden; */
}
u {
  text-decoration: none;
}
</style>
