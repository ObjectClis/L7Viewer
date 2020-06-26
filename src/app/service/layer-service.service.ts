import { Injectable, OnInit } from '@angular/core';
import { Scene, PointLayer, RasterLayer, LineLayer, Popup, Layers } from "@antv/l7";
import { GaodeMap, Mapbox } from "@antv/l7-maps"
import * as GeoTIFF from 'geotiff';

// import * from "./../"

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  globalLayerSet2: any = []; // 测试数据

  globalLayerSet: any = {}; // 图层源数据
  scene: Scene; // 场景
  layersControl: Layers; // 图层控制器控件
  overlayers: object = {}; // 图层控制器列表

  // constructor(scene: Scene) {
  //   this.scene = scene;
  // }

  constructor() { }

  init(scene: Scene) {
    this.scene = scene;
  }

  loadDefaultLayers(index) {
    /**
     * 加载默认进入图层
     */
    console.log('加载首页默认图层');
    this.addLayerByFormatObj(this.globalLayerSet['layerSources']['1矿山']['1基本信息']);
    this.addLayerByFormatObj(this.globalLayerSet['layerSources']['2港口']['1基本信息']);
    this.addLayerByFormatObj(this.globalLayerSet['layerSources']['3能源']['1基本信息']);
    this.addLayerByFormatObj(this.globalLayerSet['layerSources']['4铁路']['1基本信息']);
    this.addLayerByFormatObj(this.globalLayerSet['layerSources']['5机场']['1基本信息']);
    this.addLayerByFormatObj(this.globalLayerSet['layerSources']['6园区']['1基本信息']);

    // this.addLayerByUrl(this.layerSources);


  }

  loadYDYLLayers(index) {
    /**
     * 加载一带一路底图数据
     */
    this.addLayerByFormatObj(this.globalLayerSet['common']['一带一路']['海上路线']);
    this.addLayerByFormatObj(this.globalLayerSet['common']['一带一路']['陆上路线']);

  }


  loadTestLayers(index) {
    /**
     * 加载一带一路底图数据
     */
    this.addLayerByFormatObj(this.globalLayerSet['test']['测试']['夜光遥感']);

  }



  addLayerByUrl(url, isAddInControl = true) {
    /**
     * 通过URL加载图层（数据格式：GeoJson）
     */
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('dsds');
        const features = data.features
        if (features.length > 0) {
          switch (features[0].geometry.type) {
            case 'Point':
              const pointLayer = new PointLayer({});
              pointLayer.source(data)
                .shape('circle')
                // // .size('id', [ 5, 20 ])
                // .color('mineral', mineral => {
                //   return mineral == '铜矿' ? '#5B8FF9' : '#5CCEA1';
                // })
                .color('class', cls => {
                  switch (cls.replace(/^\s+|\s+$/g, "")) { // 去掉空格
                    case '矿山项目':
                      return '#996633';
                      break;
                    case '港口项目':
                      return '#3366FF';
                      break;
                    case '能源项目':
                      return '#33FF33';
                      break;
                    case '铁路项目':
                      return '#99CCCC';
                      break;
                    case '机场项目':
                      return '#9933FF';
                      break;
                    case '园区项目':
                      return '#CC0000';
                      break;
                    default:
                      return '#ffffff';
                      break;
                  }
                })
                .active(true)
                .style({
                  opacity: 0.3,
                  strokeWidth: 1
                });

              if (features[0].properties['class'].replace(/^\s+|\s+$/g, "") == '能源项目') {
                pointLayer.shape('cylinder')
                  .size('capacity', function (capacity) {
                    return [4, 4, capacity * 10];
                  })
                  .style({
                    opacity: 1,
                    strokeWidth: 1
                  });
              }

              pointLayer.on('mousemove', this.LayerMouseOver);

              this.overlayers = {
                图层: pointLayer
              }

              this.layersControl = new Layers({
                overlayers: this.overlayers
              })

              this.scene.addControl(this.layersControl);

              this.scene.addLayer(pointLayer);
              break;
            case 'LineString':
              const lineLayer = new LineLayer({});
              lineLayer.source(data)
                .size(0.3)
                // .color('#00BFFF') // 蓝色
                .color('#ffffff')  // 白色
                .shape('line');
              this.scene.addLayer(lineLayer);


              break;
            default:
              console.log('图层属性未能识别到：' + features[0].geometry.type)
              break;
          }
        }
      })
  }

  addLayerByFormatObj(obj) {
    /**
     * 通过预设平台标准数据格式加载图层（数据格式：GeoJson）
     */
    switch (obj.type) {
      case 'point':
        this.AddPointLayer(obj);
        break;
      case 'line':
        this.AddLineLayer(obj);
        break;
      case 'tiff':
        // this.AddRasterLayer(obj);
        break;
      default:

        break;

    }
  }

  AddPointLayer(obj) {
    fetch(obj.url)
      .then(res => res.json())
      .then(data => {
        const features = data.features;
        if (features.length > 0) {

          const pointLayer = new PointLayer({});
          pointLayer.source(data)     // 设定数据源
            .color(obj.color)      // 设定颜色
            .active(obj.active)      // 设定默认激活状态
            .shape(obj.shape)      // 设定形状
            .style({
              opacity: obj.opacity,      // 设定样式：透明度
              strokeWidth: obj.strokeWidth      // 设定样式：边线宽度
            });

          if (obj.show == '2d') {
            pointLayer.size([obj.size.x, obj.size.y]);      // 设定二维坐标
          } else if (obj.show == '3d') {
            if (typeof obj.size.z == 'number') {
              pointLayer.size([obj.size.x, obj.size.y, obj.size.z]);      // 设定三维坐标：Z轴为固定值
            }
            else {
              pointLayer.size(obj.size.z, function (z) {
                return [obj.size.x, obj.size.y, z * obj.size.multiple];      // 设定三维坐标：Z轴为属性变化值（multiple：Z值乘倍数）
              });
            }
          }

          if (obj.mousemovePop) {      // 设定该图层元素是否添加光标移动显示属性框
            pointLayer.on('mousemove', this.LayerMouseOver);
          }

          this.scene.addLayer(pointLayer);

          if (obj.control) {      // 设定是否受到图层列表控件控制
            this.overlayers[obj.title] = pointLayer;
            if (this.scene.getControlByName("layersCtrl")) {
              this.scene.removeControl(this.scene.getControlByName("layersCtrl"));
            }

            this.layersControl = new Layers({
              name: "layersCtrl",
              overlayers: this.overlayers
            })
            this.scene.addControl(this.layersControl);
          }
        }
      })
  }

  AddLineLayer(obj) {
    fetch(obj.url)
      .then(res => res.json())
      .then(data => {
        const features = data.features;
        if (features.length > 0) {
          const lineLayer = new LineLayer({
            blend: 'normal'
          });
          lineLayer.source(data)     // 设定数据源
            .color(obj.color)      // 设定颜色
            .active(obj.active)      // 设定默认激活状态
            .shape(obj.shape)      // 设定形状
            .style({
              opacity: obj.opacity,      // 设定样式：透明度
              strokeWidth: obj.strokeWidth      // 设定样式：边线宽度
            })
            .animate({
              enable: obj.animate.enable,     // 设定线条动画：开关
              interval: obj.animate.interval,     // 设定线条动画：轨迹间隔
              trailLength: obj.animate.trailLength,      // 设定线条动画：轨迹长度
              duration: obj.animate.duration      // 设定线条动画：持续时间
            });


          if (obj.show == '2d') {
            lineLayer.size([obj.size.width, obj.size.height]);      // 设定二维坐标


          } else if (obj.show == '3d') {
            if (typeof obj.size.z == 'number') {
              lineLayer.size([obj.size.x, obj.size.y, obj.size.z]);      // 设定三维坐标：Z轴为固定值
            }
            else {
              lineLayer.size(obj.size.z, function (z) {
                return [obj.size.x, obj.size.y, z * obj.size.multiple];      // 设定三维坐标：Z轴为属性变化值（multiple：Z值乘倍数）
              });
            }
          }

          if (obj.mousemovePop) {      // 设定该图层元素是否添加光标移动显示属性框
            lineLayer.on('mousemove', this.LayerMouseOver);
          }

          this.scene.addLayer(lineLayer);

          if (obj.control) {      // 设定是否受到图层列表控件控制
            this.overlayers[obj.title] = lineLayer;
            if (this.scene.getControlByName("layersCtrl")) {
              this.scene.removeControl(this.scene.getControlByName("layersCtrl"));
            }

            this.layersControl = new Layers({
              name: "layersCtrl",
              overlayers: this.overlayers
            })
            this.scene.addControl(this.layersControl);
          }

        }
      })
  }

  // async AddRasterLayer(obj) {

  //   const tiffdata = await this.getTiffData();

  //   const layer = new RasterLayer({});
  //   layer
  //     .source(tiffdata.data, {
  //       parser: {
  //         type: 'raster',
  //         width: tiffdata.width,
  //         height: tiffdata.height,
  //         extent: [73.4821902409999979, 3.8150178409999995, 135.1066187319999869, 57.6300459959999998]
  //       }
  //     })
  //     .style({
  //       opacity: 1.0,
  //       clampLow: false,
  //       clampHigh: false,
  //       domain: [0, 90],
  //       nodataValue: 0,
  //       rampColors: {
  //         colors: ['rgba(92,58,16,0)', 'rgba(92,58,16,0)', '#fabd08', '#f1e93f', '#f1ff8f', '#fcfff7'],
  //         positions: [0, 0.05, 0.1, 0.25, 0.5, 1.0]
  //       }
  //     });

  //   this.scene.addLayer(layer);



  // }

  async AddRasterLayer(obj) {

    // const tiff = await GeoTIFF.fromUrl('https://gw.alipayobjects.com/zos/antvdemo/assets/light_clip/lightF182013.tiff');

    // // using local ArrayBuffer
    // const response = await fetch('https://gw.alipayobjects.com/zos/antvdemo/assets/light_clip/lightF182013.tiff');
    // const arrayBuffer = await response.arrayBuffer();
    // const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);

    const response = await fetch(
      'https://gw.alipayobjects.com/zos/antvdemo/assets/light_clip/lightF182013.tiff'
    );
    const arrayBuffer = await response.arrayBuffer();
    // const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);

    console.log('tiff');


    // fetch(obj.url)
    // .then(res => {
    //   // const sss=res.arrayBuffer();
    //   res.arrayBuffer().then(
    //     bbb=>{
    //       const s='dsds';
    //       console.log('tiff1');
    //     }
    //   )
    //   console.log('tiff2');
    // })
    // .then(data => {

    // })
  }




  //  async getTiffData() {
  //   const response = await fetch(
  //     'https://gw.alipayobjects.com/zos/antvdemo/assets/light_clip/lightF182013.tiff'
  //   );
  //   const arrayBuffer = await response.arrayBuffer();
  //   const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  //   const image = await tiff.getImage();
  //   const width = image.getWidth();
  //   const height = image.getHeight();
  //   const values = await image.readRasters();
  //   return {
  //     data: values[0],
  //     width,
  //     height
  //   };
  // }


  LayerMouseOver = e => {
    /**
     * 光标经过要素的事件
     */
    const properties = e.feature.properties;
    var table = document.createElement('table');

    for (const key in properties) {
      if (properties.hasOwnProperty(key)) {
        const value = properties[key];
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.innerHTML = key;
        var td2 = document.createElement('td');
        td2.innerHTML = value;
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
      }
    }
    const popup = new Popup({
      offsets: [0, 0],
      closeButton: false
    })
      .setLnglat(e.lngLat)
      .setDOMContent(table)

    this.scene.addPopup(popup);

  }


}
