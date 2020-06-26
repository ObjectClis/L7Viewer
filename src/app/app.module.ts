import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';


import { DemoNgZorroAntdModule } from './ng-zorro-antd';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { MainMapComponent } from './main-map/main-map.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SiderItemComponent } from './components/sider-item/sider-item.component';
import { SiderMenuComponent } from './components/sider-menu/sider-menu.component';
import { MenuTreeComponent } from './components/menu-tree/menu-tree.component';


registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    MainMapComponent,
    MainLayoutComponent,
    SiderItemComponent,
    SiderMenuComponent,
    MenuTreeComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoNgZorroAntdModule,
    NzIconModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
