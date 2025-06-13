import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-list-with-expandedrows',
  templateUrl: './list-with-expandedrows.component.html',
  imports: [ MatTableModule, MatIconModule, CdkDrag, CdkDropList,MatButtonModule, MatExpansionModule, NgFor, NgIf, MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule,],
  standalone:true,
  styleUrls: ['./list-with-expandedrows.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListWithExpandedrowsComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() { }

  trackByPosition(index: number, element: PeriodicElement): number {
    return element.position;
  }

  @ViewChildren(MatTable) table : QueryList<MatTable<PeriodicElement> | undefined> | undefined;

  protected onClickParent = (parentClicked:PeriodicElement)=>{
    console.log(parentClicked)
    const parent = this.dataSource.findIndex((item) => item.position === parentClicked.position);
    if(parent > -1 && this.dataSource?.[parent]?.children !== undefined) {
      this.dataSource[parent].expanded = !this.dataSource[parent].expanded;
      this.table?.forEach((x) => x?.renderRows());
      //element.expanded = !element.expanded
    }
    console.log(this.dataSource[this.dataSource.findIndex((item) => item.position === parentClicked.position)])
    
  }

  protected onDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
    this.table?.get(0)?.renderRows();
  }

  protected onDropChildren(event: CdkDragDrop<any[]>, parentPosition: number) {
    const parent = this.dataSource.findIndex((item) => item.position === parentPosition);

    if(parent > -1 && this.dataSource?.[parent]?.children !== undefined) {
      moveItemInArray(this.dataSource[parent].children ?? [], event.previousIndex, event.currentIndex);
      this.table?.forEach((x) => x?.renderRows());
    }
  }

  public dataSource: PeriodicElement[] = [
    {
      position: 1,
      name: 'Hydrogen',
      weight: 1.0079,
      symbol: 'H',
      expanded: false,
      children:[
        {
          position: 1,
          name: 'Hydrogen Child 1',
          weight: 55555,
          symbol: 'HA',
          expanded: false,
          description:'Pepitoooo'
        },
        {
          position: 2,
          name: 'Hydrogen Child 2',
          weight: 11111,
          symbol: 'HA',
          expanded: false,
          description:'Pepitoooo 2'
        }
      ],
      description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
    }, {
      position: 2,
      name: 'Helium',
      weight: 4.0026,
      symbol: 'He',
      expanded: false,
      children:[
        {
          position: 1,
          name: 'Hydrogen Child 1',
          weight: 55555,
          symbol: 'HA',
          expanded: false,
          description:'Pepitoooo'
        },
        {
          position: 2,
          name: 'Hydrogen Child 2',
          weight: 11111,
          symbol: 'HA',
          expanded: false,
          description:'Pepitoooo 2'
        }
      ],
      description: `Helium is a chemical element with symbol He and atomic number 2. It is a
      colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
      group in the periodic table. Its boiling point is the lowest among all the elements.`
    }, {
      position: 3,
      name: 'Lithium',
      weight: 6.941,
      symbol: 'Li',
      expanded: false,
      description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
      silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
      lightest solid element.`
    }
  ];

  public columnsToDisplay = ['name', 'weight', 'symbol', 'position','action'];

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
  expanded:boolean;
  children?:PeriodicElement[];
}
