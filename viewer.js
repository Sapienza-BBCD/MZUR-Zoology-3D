import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
const view=document.querySelector('#view'),status=document.querySelector('#status');
try {
const scene=new THREE.Scene();scene.background=new THREE.Color(0xd9d9d9);
const camera=new THREE.PerspectiveCamera(40,1,.001,1000);const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;view.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.autoRotateSpeed=1;
const ambient=new THREE.HemisphereLight(0xffffff,0xcccccc,2);scene.add(ambient);const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(3,5,4);scene.add(light);const fill=new THREE.DirectionalLight(0xffffff,.8);fill.position.set(-3,1,-4);scene.add(fill);
const brightness=document.querySelector('#brightness');function updateBrightness(){const v=Number(brightness.value)/100;ambient.intensity=2*v;light.intensity=2*v;fill.intensity=1.15*v;document.querySelector('#brightnessValue').textContent=brightness.value+'%';}brightness.addEventListener('input',updateBrightness);updateBrightness();
const loader=new GLTFLoader(),draco=new DRACOLoader();draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/');loader.setDRACOLoader(draco);loader.setMeshoptDecoder(MeshoptDecoder);
let home=null;function reset(){if(home){camera.position.copy(home);controls.target.set(0,0,0);controls.update();}}
function resize(){const w=view.clientWidth,h=view.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(view);resize();
loader.load(view.dataset.model,g=>{const group=new THREE.Group();group.add(g.scene);scene.add(group);const b=new THREE.Box3().setFromObject(g.scene),center=b.getCenter(new THREE.Vector3()),size=b.getSize(new THREE.Vector3());g.scene.position.sub(center);group.scale.setScalar(2/(Math.max(size.x,size.y,size.z)||1));const d=3/Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*Math.max(1,1/camera.aspect);home=new THREE.Vector3(0,d*.2,d);reset();status.textContent='Trascina per ruotare · Rotella per zoom · Tasto destro per spostare';},p=>status.textContent='Caricamento… '+(p.total?Math.round(p.loaded/p.total*100)+'%':(p.loaded/1e6).toFixed(1)+' MB'),e=>status.textContent='Errore nel caricamento del modello: '+(e.message||e));
document.querySelector('#reset').onclick=reset;document.querySelector('#rotate').onclick=e=>{controls.autoRotate=!controls.autoRotate;e.target.textContent='Rotazione automatica: '+(controls.autoRotate?'SÌ':'NO');};document.querySelector('#full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await view.requestFullscreen();}catch(e){status.textContent='Schermo intero non disponibile.';}};renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});
}catch(e){status.textContent='Visualizzatore non disponibile: '+e.message;}
