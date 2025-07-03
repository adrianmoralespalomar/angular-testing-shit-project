import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { InputTextComponent } from '../input-text/input-text.component';

export interface TransferItem {
  id: string | number;
  description: string;
}

@Component({
  selector: 'app-dual-list-transfer',
  standalone: true,
  templateUrl: './dual-list-transfer.component.html',
  styleUrls: ['./dual-list-transfer.component.css'],
  imports: [CommonModule, FormsModule, InputTextComponent, CheckboxComponent],
})
export class DualListTransferComponent {
  @Input() availableItems: TransferItem[] = [];
  @Input() selectedItems: TransferItem[] = [];
  @Output() selectionChanged = new EventEmitter<{
    availableItems: TransferItem[];
    selectedItems: TransferItem[];
  }>();

  availableFilter = '';
  selectedFilter = '';

  availableChecked = new Set<number | string>();
  selectedChecked = new Set<number | string>();

  get filteredAvailable(): TransferItem[] {
    const filter = this.normalizeText(this.availableFilter);
    return this.availableItems.filter((item) => this.normalizeText(item.description).includes(filter));
  }

  get filteredSelected(): TransferItem[] {
    const filter = this.normalizeText(this.selectedFilter);
    return this.selectedItems.filter((item) => this.normalizeText(item.description).includes(filter));
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD') // descompone letras acentuadas (é → e + ́)
      .replace(/\p{Diacritic}/gu, ''); // elimina los diacríticos (el acento)
  }

  moveToSelected() {
    const moved = this.availableItems.filter((item) => this.availableChecked.has(item.id));
    this.selectedItems = [...this.selectedItems, ...moved];
    this.availableItems = this.availableItems.filter((item) => !this.availableChecked.has(item.id));
    this.availableChecked.clear();
    this.emitChange();
  }

  moveToAvailable() {
    const moved = this.selectedItems.filter((item) => this.selectedChecked.has(item.id));
    this.availableItems = [...this.availableItems, ...moved];
    this.selectedItems = this.selectedItems.filter((item) => !this.selectedChecked.has(item.id));
    this.selectedChecked.clear();
    this.emitChange();
  }

  toggleSelection(set: Set<string | number>, id: string | number) {
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
  }

  private emitChange() {
    this.selectionChanged.emit({
      availableItems: this.availableItems,
      selectedItems: this.selectedItems,
    });
  }
}
