import {EventEmitter, Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {TreeNode} from './TreeNode';

export {DomHandler} from '../dom/domhandler';
export {MenuItem} from './MenuItem';
export {TreeNode} from './TreeNode';

export interface SortMeta {
    field: string;
    order: number;
}

export interface LazyLoadEvent {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number;
    multiSortMeta?: SortMeta[];
    filters?: {[s: string]: FilterMetadata;};
    globalFilter?: any;
}

export interface FilterMetadata {
    value?: any;
    matchMode?: string;
}

export interface Message {
    severity?: string;
    summary?: string;
    detail?: string;
    id?: any;
}

export interface SelectItem {
    label: string;
    value: any;
    id: any;
    name: any;
}

export interface Confirmation {
    message: string;
    key?: string;
    icon?: string;
    header?: string;
    accept?: Function;
    reject?: Function;
    acceptVisible?: boolean;
    rejectVisible?: boolean;
    acceptEvent?: EventEmitter<any>;
    rejectEvent?: EventEmitter<any>;
}

export interface BlockableUI {
    getBlockableElement(): HTMLElement;
}

@Injectable()
export class ConfirmationService {

    private requireConfirmationSource = new Subject<Confirmation>();
    private acceptConfirmationSource = new Subject<Confirmation>();

    requireConfirmation$ = this.requireConfirmationSource.asObservable();
    accept = this.acceptConfirmationSource.asObservable();

    confirm(confirmation: Confirmation) {
        this.requireConfirmationSource.next(confirmation);
        return this;
    }

    onAccept() {
        this.acceptConfirmationSource.next();
    }
}

export interface TreeNodeDragEvent {
    tree?: any;
    node?: TreeNode;
    subNodes?: TreeNode[];
    index?: number;
    scope?: any;
}

@Injectable()
export class TreeDragDropService {

    private dragStartSource = new Subject<TreeNodeDragEvent>();
    private dragStopSource = new Subject<TreeNodeDragEvent>();

    dragStart$ = this.dragStartSource.asObservable();
    dragStop$ = this.dragStopSource.asObservable();

    startDrag(event: TreeNodeDragEvent) {
        this.dragStartSource.next(event);
    }

    stopDrag(event: TreeNodeDragEvent) {
        this.dragStopSource.next(event);
    }
}
