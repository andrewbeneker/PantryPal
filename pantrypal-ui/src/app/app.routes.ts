import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './user/login/login/login.component';
import { RegisterComponent } from './user/sign-up/registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { PantryitemComponent } from './pantryitem/pantryitem.component';
import { FavoritesComponent } from './favorites/favorites.component';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'pantry', component: PantryitemComponent, canActivate: [authGuard] },
    { path: 'recipes/search', component: RecipeSearchComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    {path: 'favorites', component: FavoritesComponent, canActivate: [authGuard]},
    { path: '**', redirectTo: 'login' }, // fallback
];
