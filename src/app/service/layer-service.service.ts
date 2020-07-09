import { Injectable, OnInit } from '@angular/core';
import { Scene, PointLayer, RasterLayer, LineLayer, Popup, Layers, BaseLayer } from "@antv/l7";
import { GaodeMap, Mapbox } from "@antv/l7-maps"
import * as GeoTIFF from 'geotiff';

import { MainMapComponent } from '../main-map/main-map.component';

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

  mapContainer;

  

  // constructor(scene: Scene) {
  //   this.scene = scene;
  // }

  constructor() { }

  init(scene: Scene, container) {
    this.scene = scene;
    this.mapContainer = container;
    this.mapContainer.drawerVisible=true;
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
        this.AddRasterLayer(obj);
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
          this.SetLayerConfig(pointLayer, obj.config);
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

  SetLayerConfig(layer: BaseLayer, config: Object) {
    for (const key in config) {
      if (config.hasOwnProperty(key)) {
        layer[key] = config[key];
      }
    }
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

          this.SetLayerConfig(lineLayer, obj.config);

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

        }
      })
  }

  async getTiffData(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const width = image.getWidth();
    const height = image.getHeight();
    const values = await image.readRasters();
    return {
      data: values[0],
      width,
      height
    };
  }

  async AddRasterLayer(obj) {
    const tiffdata = await this.getTiffData(obj.url);


    const tiffLayer = new RasterLayer({});
    this.SetLayerConfig(tiffLayer, obj.config);
    tiffLayer.source(tiffdata.data, {
      parser: {
        type: 'raster',
        width: tiffdata.width,
        height: tiffdata.height,
        extent: obj.extent
      }
    })
      .style({
        opacity: obj.opacity,
        clampLow: obj.clampLow,
        clampHigh: obj.clampHigh,
        domain: obj.domain,
        nodataValue: obj.noDataValue,
        rampColors: {
          colors: obj.rampColors.colors,
          positions: obj.rampColors.positions
        }
      });

    this.scene.addLayer(tiffLayer);

    if (obj.control) {      // 设定是否受到图层列表控件控制
      this.overlayers[obj.title] = tiffLayer;
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


  LayerMouseOver = e => {
    /**
     * 光标经过要素的事件
     */
    const properties = e.feature.properties;
    var div = document.createElement('div');

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


    var a = document.createElement('a');
    a.innerHTML = "更多";

    a.onclick = () => {
      let  drawerMsg = {
        propertiesArr: [
          { key: '1', value: '测试展示' }
        ],
        articleArr:[
          {key:'1',value:'“一带一路”（The Belt and Road，缩写B&R）是“丝绸之路经济带”和“21世纪海上丝绸之路”的简称，2013年9月和10月由中国国家主席习近平分别提出建设“新丝绸之路经济带”和“21世纪海上丝绸之路”的合作倡议 [1]  。依靠中国与有关国家既有的双多边机制，借助既有的、行之有效的区域合作平台，一带一路旨在借用古代丝绸之路的历史符号，高举和平发展的旗帜，积极发展与沿线国家的经济合作伙伴关系，共同打造政治互信、经济融合、文化包容的利益共同体、命运共同体和责任共同体。'},
          {key:'2',value:'2015年3月28日，国家发展改革委、外交部、商务部联合发布了《推动共建丝绸之路经济带和21世纪海上丝绸之路的愿景与行动》。'},
          {key:'3',value:'“一带一路"经济区开放后，承包工程项目突破3000个。2015年，中国企业共对“一带一路”相关的49个国家进行了直接投资，投资额同比增长18.2% [4]  。2015年，中国承接“一带一路”相关国家服务外包合同金额178.3亿美元，执行金额121.5亿美元，同比分别增长42.6%和23.45%。'},
        ],
        pictureArr:[
          {key:'1',url:'http://5b0988e595225.cdn.sohucs.com/images/20171128/5ad31c4a4ef24dde8e9e7d76938921ea.jpeg',remark:'图片1介绍文字'},
          {key:'2',url:'http://n.sinaimg.cn/translate/203/w1000h803/20190124/UbyI-hryfqhm6398069.png',remark:'图片2介绍文字'},
          {key:'3',url:'http://img.mp.sohu.com/upload/20170704/d3fd1cd04c5b4642af8a491082cde1c4_th.png',remark:'图片3介绍文字'}
        ],
        videoArr:[
          {key:'1',url:'https://www.w3school.com.cn/i/movie.ogg',remark:'视频1介绍文字'},
          {key:'2',url:'https://www.w3school.com.cn/i/movie.ogg',remark:'视频2介绍文字'},
        ]
    
      };

      for (const key in e.feature.properties) {
        if (e.feature.properties.hasOwnProperty(key)) {
          const element = e.feature.properties[key];
          drawerMsg.propertiesArr.push(
            {key:key,value:element}
          )

          
          
        }
      }

      this.openMainmapDrawer(drawerMsg);
    }



    div.appendChild(table);
    div.appendChild(a);


    const popup = new Popup({
      offsets: [0, 0],
      closeButton: false
    })
      .setLnglat(e.lngLat)
      .setDOMContent(div)

    this.scene.addPopup(popup);

  }

  openMainmapDrawer = (drawerMsg) => {
    this.mapContainer.drawerMsg = drawerMsg;
    // this.mapContainer.drawerVisible = true;
    this.mapContainer.openDrawer();
  }


}
