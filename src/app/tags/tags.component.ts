import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TagsFilterModalComponent } from '../core/modals/tags-filter-modal/tags-filter-modal.component';
import { UtilService } from '../shared/services/util.service';
import { TagService } from '../shared/services/tag.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  public user : any;
  public show_sidebar : boolean = true;
  widgets: any = [];
  enteredData: any;
  showsome: boolean = false;
  page:Number = 1;
  totalCount:Number;
  pageSize:Number = 10;
  offset:Number = 0;
  allResourcesArr:any=[];
  allTags:any=[];
  customTags:any=[];
  companyTags:any=[];
  nonTaggedTags:any=[];
  
  constructor(public modalService: NgbModal, private utilService:UtilService, private tagService:TagService) { }

  ngOnInit() {
    this.getAllResources();
    let types = [0,1,2,3];
    for(let index of types) {
      const obj = {type:index}
      this.listAllTags(obj);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 1000);
  }

  getAllResources() {
    const obj = {limit:this.pageSize,offset:this.offset}
    this.tagService.getAllResources(obj).subscribe((res:any) => {
      if(!res.error && res.data.length > 0){
        this.allResourcesArr = res && res.data ? res : [];
        this.totalCount = res.totalcount
      }
    }, err => {
    })
  }

  listAllTags(obj) {
    this.tagService.listAllTags(obj).subscribe((res:any) => {
      if(!res.error && res.data.length > 0){
        if(res && res.data){
          if(obj.type == 0) {
            this.allTags = res.data
          } else if(obj.type == 1) {
            this.companyTags = res.data
          }else if(obj.type == 2) {
            this.customTags = res.data
          }else if(obj.type == 3) {
            this.nonTaggedTags = res.data
          }
        }
      }
    }, err => {
    })
  }

  removeTag() {

  }
  
  open(){
  this.modalService.open(TagsFilterModalComponent);
  }
  toggle(){
    this.show_sidebar = !this.show_sidebar;
  }

  showAddBtn(data){
    this.widgets.push(data.key)
    if(this.widgets.length >= 1){
      this.showsome = true;
    }else{
      this.showsome = false;
    }
  }

  valuechange(event){
    if(this.totalCount > 10) {
      this.pageSize = event.target.value;
      this.page = 1;
      this.getAllResources();
      setTimeout(() => {
        this.utilService.setNavHeight('commonContainer')
      }, 1000);
    }
  }
  
  
  // private getDismissReason(reason: any): string {

  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return  `with: ${reason}`;
  //   }
  // }

}
