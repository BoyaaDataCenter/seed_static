import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import {PanelMenuModule, MenuModule, PanelModule, DataTableModule, ToolbarModule,
  SharedModule as priSharedModule, InputTextModule, ButtonModule, TooltipModule,
  OverlayPanelModule, DropdownModule, SelectButtonModule, RadioButtonModule,
  MultiSelectModule, CheckboxModule, ConfirmDialogModule, PaginatorModule, SlideMenuModule,
  FieldsetModule, ToggleButtonModule} from '../primeng/primeng';
// import { KeyDataComponent } from './key-data/key-data.component';
import { EchartsComponent } from './echarts/echarts.component';
import { DataTableComponent } from './data-table/data-table.component';
import { NumberFormatPipe } from './number-format.pipe';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { FlatpickrComponent } from './flatpickr/flatpickr.component';
import { SingleSelectComponent } from './single-select/single-select.component';
import { HelpInfoComponent } from './help-info/help-info.component';
// import { TabComponent } from './tab/tab.component';
import { LoadingComponent } from './loading/loading.component';
import {FilterPipe} from './filter.pipe';
import {InputTextareaModule} from '../primeng/components/inputtextarea/inputtextarea';
import { DynamicFormComponent } from './form/dynamic-form/dynamic-form.component';
import { DynamicFormItemComponent } from './form/dynamic-form-item/dynamic-form-item.component';
import { UserSelectorComponent } from './user-selector/user-selector.component';
import { DropdownComponent } from './dropdown/dropdown.component';

/**
 * 共享模块
 * 管理多实例的组件
 */
@NgModule({
  imports: [
    CommonModule, PanelMenuModule, PanelModule,
    MenuModule, DataTableModule, priSharedModule,
    ToolbarModule, InputTextModule, ButtonModule,
    TooltipModule, OverlayPanelModule, DropdownModule,
    SelectButtonModule, FormsModule, ReactiveFormsModule, RadioButtonModule,
    MultiSelectModule, CheckboxModule, InputTextareaModule,
    ConfirmDialogModule, PaginatorModule, SlideMenuModule,FieldsetModule,
    ToggleButtonModule
  ],
  declarations: [
    EchartsComponent, DataTableComponent,
    NumberFormatPipe, MultiSelectComponent, FlatpickrComponent,
    SingleSelectComponent, HelpInfoComponent, LoadingComponent,
    FilterPipe,
    DynamicFormComponent, DynamicFormItemComponent, UserSelectorComponent, DropdownComponent],
  exports: [
    PanelMenuModule, MenuModule, PanelModule,
    DataTableModule, priSharedModule, ToolbarModule,
    ButtonModule, InputTextModule, OverlayPanelModule,
    TooltipModule, DropdownModule, MultiSelectModule,
    EchartsComponent, DataTableComponent, RadioButtonModule,
    NumberFormatPipe, MultiSelectComponent, FlatpickrComponent,
    SelectButtonModule, SingleSelectComponent, HelpInfoComponent,
    CheckboxModule, LoadingComponent, FilterPipe, InputTextareaModule, ToggleButtonModule,
    ConfirmDialogModule, PaginatorModule, DynamicFormComponent, SlideMenuModule, FieldsetModule, DropdownComponent
  ]
})
export class SharedModule { }
