import { AfterViewInit, Component, ViewChild, OnInit, Output, Input } from '@angular/core';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { LayerService } from "../../service/layer-service.service";
import { Scene } from "@antv/l7";


@Component({
  selector: 'app-menu-tree',
  templateUrl: './menu-tree.component.html',
  styleUrls: ['./menu-tree.component.css']
})
export class MenuTreeComponent implements AfterViewInit, OnInit {
  // @Input() globalLService: LayerService;
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;

  @Input()
  set globalLService(globalLService: LayerService) {
    this._globalLService = globalLService;
    this.nodes = this._globalLService.globalLayerSet;

    this.defaultCheckedKeys = this.recursionDatasInit(this.nodes);
  }

  layerService: LayerService;

  nodes;

  recursionDatasInit(nodes) {
    var arr = [];
    nodes.forEach(node => {
      if (node.children) {
        arr = arr.concat(this.recursionDatasInit(node.children));
      } else {
        if (node.checked) {
          arr = arr.concat(node.key);
          this._globalLService.addLayerByFormatObj(node.layerInfo)
          return arr
        }
      }
    });
    return arr;
  }

  get globalLService(): LayerService { return this._globalLService; }

  _globalLService: LayerService;
  defaultCheckedKeys = ['1-1'];
  defaultSelectedKeys = ['3'];
  defaultExpandedKeys = ['1', '3'];

 


  ngOnInit() {
    
    }



  nzClick(event: NzFormatEmitEvent): void {
    console.log("点击事件：" + event);
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log("勾选事件：" + event);
    if(event.node.isChecked){
      this._globalLService.addLayerByFormatObj(event.node.origin.layerInfo);
    }else{
      const layerName=event.node.origin.layerInfo.config.name;
      const layer = this._globalLService.scene.getLayerByName(layerName);
      this._globalLService.scene.removeLayer(layer);
    }
  }

  // // nzSelectedKeys change
  // nzSelect(keys: string[]): void {
  //   console.log("选择事件：" + keys, this.nzTreeComponent.getSelectedNodeList());
  // }


  // 初始化完组件视图及其子视图之后调用
  ngAfterViewInit(): void {

    //  this.layerService=new LayerService();
    // this.nodes2=this.layerService.globalLayerSet2;





    // get node by key: '10011'
    console.log(this.nzTreeComponent.getTreeNodeByKey('1'));
    // use tree methods
    console.log(
      this.nzTreeComponent.getTreeNodes(),
      this.nzTreeComponent.getCheckedNodeList(),
      this.nzTreeComponent.getSelectedNodeList(),
      this.nzTreeComponent.getExpandedNodeList()
    );
  }



}
