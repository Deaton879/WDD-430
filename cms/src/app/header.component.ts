import { Component, EventEmitter, Output } from "@angular/core";

@Component ({
    selector: 'cms-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent {
    @Output() selectedFeatureEvent = new EventEmitter<string>();

    onSelect(feature: string) {
        this.selectedFeatureEvent.emit(feature);
    }
}