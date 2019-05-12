import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TagsFilterModalComponent } from '../core/modals/tags-filter-modal/tags-filter-modal.component';
import { UtilService } from '../shared/services/util.service';
import { TagService } from '../shared/services/tag.service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {TagsSelectModalComponent } from '../core/modals/tags-select-modal/tags-select-modal.component';
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
  tagsArr: any;
  searchword: any = [];
  singleString: any;
  tagsResultArray: any = [];
  headerTags:any=[];
  companySearchValue:any='';
  customeSearchValue:any='';
  filterTag:any=0;
  userRole:any=null;
  selectedDay: string = '';
  changeStatus:boolean = false;
  
  constructor(public modalService: NgbModal, private utilService:UtilService, private tagService:TagService) { }

  ngOnInit() {
    this.userRole = this.utilService.userRole;
    const obj = {limit:this.pageSize,offset:this.offset,type:0}
    this.getAllResources(obj);
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

  getAllResources(obj) {
    this.tagService.getAllResources(obj).subscribe((res:any) => {
      if(!res.error && res.data.length > 0){
        this.allResourcesArr = res && res.data ? res : [];
      }
      this.totalCount = res.totalcount
    }, err => {
    })
  }

  listAllTags(obj, header?) {
    this.tagService.listAllTags(obj).subscribe((res:any) => {
      if(!res.error && res.data.length > 0){
        if(res && res.data){
          if(obj.type == 0) {
            this.allTags = res.data
            this.headerTags = res.data
          } else if(obj.type == 1) {
            this.companyTags = res.data
          }else if(obj.type == 2) {
            this.customTags = res.data
          }else if(obj.type == 3) {
            this.nonTaggedTags = res.data
          }
          if(header) {
            this.headerTags = res.data
            let isSelectedTags = [];
            for(let index of res.data) {
              if(index.isselected) {
                isSelectedTags.push(index.id)
              }
            }
            let postObj = {limit:this.pageSize,offset:this.offset,type:obj.type}
            this.getAllResources(postObj);
          }
        }
      }
    }, err => {
    })
  }

  removeTag(id,type) {
    const obj = {tagid:id};
    this.tagService.removeTag(obj).subscribe((res:any) => {
      if(!res.error){
        const headerTags = this.headerTags.filter(data => data.id != id);
        this.headerTags = headerTags;
        if(type == 1) {
          const companyTags = this.companyTags.filter(data => data.id != id);
          this.companyTags = companyTags;
        } else if(type == 2) {
          const customTags = this.customTags.filter(data => data.id != id);
          this.customTags = customTags;
        }
      }
    }, err => {
    })
  }
  
  open(){
  this.changeStatus = !this.changeStatus;
  this.modalService.open(TagsFilterModalComponent);
  }

  openModal(){
    this.modalService.open(TagsSelectModalComponent, { windowClass : "customTagsSelectWidth" , centered: true});
  }

  toggle(){
    this.show_sidebar = !this.show_sidebar;
  }

  searchTag(value){
    if(value.trim() != '') {
      const postObj = {searchword:value.trim()}
      this.tagService.autoCompleteTagsList(postObj).subscribe((res:any) => {
        if(!res.error){
          this.tagsArr = res && res.data ? res : []
          this.tagsResultArray = this.tagsArr.data;
        }
      }, err => {
      })
    } else {
      this.companySearchValue = "";
      this.customeSearchValue = "";
    }
  }

  valuechange(event){
    this.pageSize = event.target.value;
    const obj = {limit:event.target.value,offset:this.page,defaultview:1}
    this.getAllResources(obj);
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 1000);
  }

  loadPage(page,pageSize) {
      this.page = page;
      const obj = {limit:this.pageSize,offset:page,defaultview:1}
      this.getAllResources(obj);
      setTimeout(() => {
        this.utilService.setNavHeight('commonContainer')
      }, 1000);
  }
  
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.tagsResultArray.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )


  // private getDismissReason(reason: any): string {

  getTags(value) {
    console.log(this.filterTag)
    this.filterTag = value;
    const obj = {type:value};
    this.listAllTags(obj,true)
  }

  clearSearchValue(type) {
    this[type] = ''
  }

  addTag(type,value) {
    const postObj = {"tagname": value,"tagtype": type}
    this.tagService.addTag(postObj).subscribe((res:any) => {
      if(!res.error){
        if(this.filterTag == type || this.filterTag == 0) {
          let data = res.data;
          data['isselected'] = false;
          this.headerTags.push(data)
        }
        if(type == 1) {
          this.companySearchValue = ''
          this.companyTags.push(res.data)
        } else if(type == 2) {
          this.customeSearchValue = ''
          this.customTags.push(res.data)
        }
      }
    }, err => {
    })
  }

  activeTag(tag) {
    let foundIndex = this.headerTags.findIndex(x => x.id == tag.id);
    this.headerTags[foundIndex]['isselected'] = !tag.isselected;
    let activetagids = [];
    let deactivetagids  = !tag.isselected ? [tag.id]:[];
    for(let index of this.headerTags) {
      if(index.isselected) {
        activetagids.push(index.id);
      } 
    }
    const postObj = {deactivetagids:deactivetagids, activetagids:activetagids,limit:this.pageSize,offset:this.offset };
    this.getAllResources(postObj);
  }

}
