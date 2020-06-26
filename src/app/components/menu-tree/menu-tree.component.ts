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
  @Input() globalLService: LayerService;
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;

  defaultCheckedKeys = ['1-1'];
  defaultSelectedKeys = ['3'];
  defaultExpandedKeys = ['1', '3'];

  layerService: LayerService;

  nodes2;

  nodes: NzTreeNodeOptions[] = [
    {
      title: '工程专题',
      key: '1',
      children: [
        {
          title: '1 矿山',
          key: '1-1'
        },
        {
          title: '2 港口',
          key: '1-2'
        },
        {
          title: '3 能源',
          key: '1-3'
        },
        {
          title: '4 铁路',
          key: '1-4'
        },
        {
          title: '5 机场',
          key: '1-5'
        },
        {
          title: '6 园区',
          key: '1-6'
        }
      ]
    },
    {
      title: '遥感专题',
      key: '2',
      children: [
        {
          title: '1 经济(灯光)',
          key: '2-1'

        },
        {
          title: '2 高光谱',
          key: '2-2'

        }
      ]
    },
    {
      title: '自然专题',
      key: '3',
      children: [
        {
          title: '1 河流水系',
          key: '3-1'

        },
        {
          title: '2 生态类型',
          key: '3-2'

        }
      ]
    },
    {
      title: '社科专题',
      key: '4',
      children: [
        {
          title: '1 人口分布',
          key: '4-1'

        },
        {
          title: '2 行政区划',
          key: '4-2'

        }
      ]
    }
  ];

  ngOnInit() {
    fetch(
      "assets/datas/layersConfig.json"
    )
      // .then(res => res.json())
      .then(res => {
        return res.json()
      })
      .then(layerCfg => {
        console.log(layerCfg)
        this.nodes=layerCfg;
       
     
      })



  }

  test(e) {
    console.log('启动测试功能:' + "添加图层");
    this.globalLService.loadTestLayers(1);
  }

  nzClick(event: NzFormatEmitEvent): void {
    console.log("点击事件：" + event);
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log("勾选事件：" + event);
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
