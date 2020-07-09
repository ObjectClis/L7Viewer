import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { Component, ngOnInit } from "@angular/core";
import { Scene, PointLayer, Popup, Layers } from "@antv/l7";
import { GaodeMap, Mapbox } from "@antv/l7-maps";
import { LayerService } from "../service/layer-service.service"
import { DataService } from "../service/data-service.service"


import { from } from 'rxjs';
// import { EventEmitter } from 'protractor';
// import { on } from 'cluster';


@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.css']
})
export class MainMapComponent implements OnInit {
  @Output() globalLService = new EventEmitter<any>();

  scene = new Scene({
    id: "map",
    map: new Mapbox({})
  }); // 主场景控件


  layerService = new LayerService();

  detailSet; // 详细属性页数据源

  constructor() { }

  ngOnInit(): void {
    console.log('进入main-map页初始化函数');

    this.scene = new Scene({
      id: "map",
      map: new Mapbox({})
    });

    this.layerService.init(this.scene, this);


    this.scene.setPitch(60); // 设定俯仰角要在setZoomAndCenter之前
    this.scene.setZoomAndCenter(3.5, [53, 14]);
    this.scene.setMapStyle('dark');


    // 获取图层源数据
    fetch(
      "assets/datas/layersConfig.json"
    )
      // .then(res => res.json())
      .then(res => {
        return res.json()
      })
      .then(data => {
        console.log(data)

        this.layerService.globalLayerSet = data;
        this.globalLService.emit(this.layerService); // 输出全局图层服务

        console.log('constructor初始化图层服务数  据完成')
        // this.layerService.loadDefaultLayers(1);

      })

  }

  drawerVisible = false;
  drawerMsg = {
    propertiesArr: [
      { key: '1', value: '测试展示' }
    ],
    articleArr:[
      {key:'1',value:'“一带一路”（The Belt and Road，缩写B&R）是“丝绸之路经济带”和“21世纪海上丝绸之路”的简称，2013年9月和10月由中国国家主席习近平分别提出建设“新丝绸之路经济带”和“21世纪海上丝绸之路”的合作倡议 [1]  。依靠中国与有关国家既有的双多边机制，借助既有的、行之有效的区域合作平台，一带一路旨在借用古代丝绸之路的历史符号，高举和平发展的旗帜，积极发展与沿线国家的经济合作伙伴关系，共同打造政治互信、经济融合、文化包容的利益共同体、命运共同体和责任共同体。'},
      {key:'2',value:'2015年3月28日，国家发展改革委、外交部、商务部联合发布了《推动共建丝绸之路经济带和21世纪海上丝绸之路的愿景与行动》。'},
      {key:'3',value:'“一带一路"经济区开放后，承包工程项目突破3000个。2015年，中国企业共对“一带一路”相关的49个国家进行了直接投资，投资额同比增长18.2% [4]  。2015年，中国承接“一带一路”相关国家服务外包合同金额178.3亿美元，执行金额121.5亿美元，同比分别增长42.6%和23.45%。'},
    ],
    pictureArr:[
      {key:'1',value:'http://5b0988e595225.cdn.sohucs.com/images/20171128/5ad31c4a4ef24dde8e9e7d76938921ea.jpeg'},
      {key:'2',value:'http://n.sinaimg.cn/translate/203/w1000h803/20190124/UbyI-hryfqhm6398069.png'},
      {key:'3',value:'http://img.mp.sohu.com/upload/20170704/d3fd1cd04c5b4642af8a491082cde1c4_th.png'}
    ],
    videoArr:[
      {key:'1',url:'https://www.w3school.com.cn/i/movie.ogg',remark:'一带一路视频1介绍文字'},
      {key:'2',url:'https://www.w3school.com.cn/i/movie.ogg',remark:'一带一路视频2介绍文字'},
    ]

  };
  // msg = { id: "2", name: '测试展示2' }



  openDrawer(): void {
    // document.createElement('nz-descriptions-item');
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }


  array = [1, 2, 3, 4];
  effect = 'scrollx';

  openUrl(url){
    console.log(url);
    window.open(url);

  }

}
