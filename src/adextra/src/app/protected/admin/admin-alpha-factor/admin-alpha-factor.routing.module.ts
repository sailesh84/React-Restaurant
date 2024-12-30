import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AlphaFactorComponent } from "@app/protected/admin/admin-alpha-factor/alpha-factor/alpha-factor.component";

const routes: Routes = [
    { path: '', component: AlphaFactorComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminAlphaFactorRoutingModule { }