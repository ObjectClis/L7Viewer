import { Injectable, OnInit } from '@angular/core';
import { Scene, PointLayer, LineLayer, Popup, Layers } from "@antv/l7";
import { GaodeMap, Mapbox } from "@antv/l7-maps"

// import * from "./../"

@Injectable({
  providedIn: 'root'
})
export class LayerServiceService {

  globalLayerSet: Object; // 图层源数据
  scene: Scene; // 场景
  layersControl: Layers; // 图层控制器控件
  overlayers: object; // 图层控制器列表

  constructor(scene: Scene) {
    this.scene = scene;
  }

  loadDefaultLayers(index) {
    /**
     * 加载默认进入图层
     */
    console.log('加载首页默认图层');
    this.addLayerByUrl(this.globalLayerSet['layerSources']['1矿山']['1基本信息']);
    this.addLayerByUrl(this.globalLayerSet['layerSources']['2港口']['1基本信息']);
    this.addLayerByUrl(this.globalLayerSet['layerSources']['3能源']['1基本信息']);
    this.addLayerByUrl(this.globalLayerSet['layerSources']['4铁路']['1基本信息']);
    this.addLayerByUrl(this.globalLayerSet['layerSources']['5机场']['1基本信息']);
    this.addLayerByUrl(this.globalLayerSet['layerSources']['6园区']['1基本信息']);

    // this.addLayerByUrl(this.layerSources);


  }

  loadYDYLLayers(index) {
    /**
     * 加载一带一路底图数据
     */
    this.addLayerByUrl(this.globalLayerSet['common']['一带一路']['海上路线']);
    this.addLayerByUrl(this.globalLayerSet['common']['一带一路']['陆上路线']);
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

              this.overlayers={
                图层:pointLayer
              }

              this.layersControl=new Layers({
                overlayers:this.overlayers
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
