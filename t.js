const sharp=require('sharp');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
<filter id="wc" x="-20%" y="-20%" width="140%" height="140%">
<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="7" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<circle cx="200" cy="200" r="120" fill="#F0D8B6" filter="url(#wc)"/>
</svg>`;
sharp(Buffer.from(svg),{density:144}).png().toFile('./t.png').then(i=>console.log(i)).catch(e=>console.log('ERR',e.message));
