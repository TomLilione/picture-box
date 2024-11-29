import{k as g,c as a,h as p,l as m,C as $,E as q,g as b,i as S,u as v,x as Q}from"./index.ad2ba990.js";var w=g({name:"QItemLabel",props:{overline:Boolean,caption:Boolean,header:Boolean,lines:[Number,String]},setup(e,{slots:l}){const t=a(()=>parseInt(e.lines,10)),c=a(()=>"q-item__label"+(e.overline===!0?" q-item__label--overline text-overline":"")+(e.caption===!0?" q-item__label--caption text-caption":"")+(e.header===!0?" q-item__label--header":"")+(t.value===1?" ellipsis":"")),r=a(()=>e.lines!==void 0&&t.value>1?{overflow:"hidden",display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":t.value}:null);return()=>p("div",{style:r.value,class:c.value},m(l.default))}});const _=["ul","ol"];var C=g({name:"QList",props:{...$,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean,tag:{type:String,default:"div"}},setup(e,{slots:l}){const t=b(),c=q(e,t.proxy.$q),r=a(()=>_.includes(e.tag)?null:"list"),n=a(()=>"q-list"+(e.bordered===!0?" q-list--bordered":"")+(e.dense===!0?" q-list--dense":"")+(e.separator===!0?" q-list--separator":"")+(c.value===!0?" q-list--dark":"")+(e.padding===!0?" q-list--padding":""));return()=>p(e.tag,{class:n.value,role:r.value},m(l.default))}});const B={position:{type:String,default:"bottom-right",validator:e=>["top-right","top-left","bottom-right","bottom-left","top","right","bottom","left"].includes(e)},offset:{type:Array,validator:e=>e.length===2},expand:Boolean};function P(){const{props:e,proxy:{$q:l}}=b(),t=S(Q,v);if(t===v)return console.error("QPageSticky needs to be child of QLayout"),v;const c=a(()=>{const o=e.position;return{top:o.indexOf("top")!==-1,right:o.indexOf("right")!==-1,bottom:o.indexOf("bottom")!==-1,left:o.indexOf("left")!==-1,vertical:o==="top"||o==="bottom",horizontal:o==="left"||o==="right"}}),r=a(()=>t.header.offset),n=a(()=>t.right.offset),f=a(()=>t.footer.offset),d=a(()=>t.left.offset),h=a(()=>{let o=0,s=0;const i=c.value,x=l.lang.rtl===!0?-1:1;i.top===!0&&r.value!==0?s=`${r.value}px`:i.bottom===!0&&f.value!==0&&(s=`${-f.value}px`),i.left===!0&&d.value!==0?o=`${x*d.value}px`:i.right===!0&&n.value!==0&&(o=`${-x*n.value}px`);const u={transform:`translate(${o}, ${s})`};return e.offset&&(u.margin=`${e.offset[1]}px ${e.offset[0]}px`),i.vertical===!0?(d.value!==0&&(u[l.lang.rtl===!0?"right":"left"]=`${d.value}px`),n.value!==0&&(u[l.lang.rtl===!0?"left":"right"]=`${n.value}px`)):i.horizontal===!0&&(r.value!==0&&(u.top=`${r.value}px`),f.value!==0&&(u.bottom=`${f.value}px`)),u}),y=a(()=>`q-page-sticky row flex-center fixed-${e.position} q-page-sticky--${e.expand===!0?"expand":"shrink"}`);function k(o){const s=m(o.default);return p("div",{class:y.value,style:h.value},e.expand===!0?s:[p("div",s)])}return{$layout:t,getStickyContent:k}}var I=g({name:"QPageSticky",props:B,setup(e,{slots:l}){const{getStickyContent:t}=P();return()=>t(l)}});export{w as Q,I as a,C as b};