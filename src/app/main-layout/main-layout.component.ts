import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { Component, ngOnInit } from "@angular/core";
import { Scene, PointLayer, Popup, Layers } from "@antv/l7";
import { GaodeMap, Mapbox } from "@antv/l7-maps";
import { LayerService } from "../service/layer-service.service"
import { DataService } from "../service/data-service.service"

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {


  globalLService;


  constructor() { }

  ngOnInit(): void {
    console.log('进入main-map页初始化函数');
  }











  globalData = {};

  changeGlobalLService(globalLService: any) {
    this.globalLService = globalLService;
  }
}
