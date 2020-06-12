import { Component, OnInit } from '@angular/core';
// import { Component, ngOnInit } from "@angular/core";
import { Scene, PointLayer, Popup, Layers } from "@antv/l7";
import { GaodeMap, Mapbox } from "@antv/l7-maps";
import { LayerServiceService } from "../service/layer-service.service"

import { from } from 'rxjs';
// import { on } from 'cluster';

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.css']
})
export class MainMapComponent implements OnInit {

  scene = new Scene({
    id: "map",
    map: new Mapbox({})
  }); // 主场景控件

  layerService = new LayerServiceService(this.scene);

  // layersControl = null; // 图层控制器控件

  // overlayers = null; // 图层控制器列表

  constructor() { }

  ngOnInit(): void {
    console.log('进入main-map页初始化函数');


    this.scene = new Scene({
      id: "map",
      map: new Mapbox({})
    });
    this.scene.setPitch(60); // 设定俯仰角要在setZoomAndCenter之前
    this.scene.setZoomAndCenter(3.5, [53, 14]);
    this.scene.setMapStyle('dark');


    // 获取图层源数据
    fetch(
      "assets/datas/source.json"
    )
      // .then(res => res.json())
      .then(res => {
        return res.json()
      }
      )
      .then(data => {
        console.log(data)
        this.layerService.scene = this.scene;
        this.layerService.globalLayerSet = data;

        console.log('constructor初始化图层服务数据完成')
        this.layerService.loadDefaultLayers(1);
        this.layerService.loadYDYLLayers(1);
        
      })
  





  





  }

}
