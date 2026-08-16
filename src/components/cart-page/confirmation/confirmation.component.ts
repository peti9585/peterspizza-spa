import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PizzaService} from '../../../services/pizza.service';
import {IOrderPizzasRequest} from '../../../interfaces/interfaces-global';
import {CartService} from '../../../services/cart.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../../services/user.service';

import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-confirmation',
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinner
],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {
  formGroup: FormGroup | undefined;
  isLoading: boolean = true;

  private readonly formBuilder = inject(FormBuilder);
  private readonly pizzaService = inject(PizzaService);
  private readonly userService = inject(UserService);
  private readonly cartService = inject(CartService);
  private readonly toasterService = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<ConfirmationComponent>);

  constructor() {
    this.userService.getUserDetailsById().subscribe({
      next: (response) => {
        this.formGroup = this.formBuilder.group({
            fullName: [{ value: response.firstName + ' ' + response.lastName, disabled: true }],
            phoneNumber: [{ value: response.phoneNumber, disabled: true }],
            email: [{ value: response.email, disabled: true }]
          }
        );
        this.isLoading = false;
      },
      error: (_) => {
        this.toasterService.error('Hiba történt a kérés során.', 'Hiba');
      }
    });
  }

  sendOrder() {
    const request = this.constructOrderRequest();
    this.pizzaService.sendOrder(request).subscribe({
      next: (_) => {
        this.cartService.removeAllFromCart();
        this.router.navigate(['/home']);
        this.dialogRef.close();
        this.toasterService.success('A rendelés sikeres volt! A rendelés állapotát a fiók menüpontban követheted nyomon.');
      },
      error: (_) => {
        this.toasterService.error("Hiba történt a rendelés leadása során.", "Hiba");
        this.dialogRef.close();
      }
    });
  }

  private constructOrderRequest(): IOrderPizzasRequest {
    const counts = this.cartService.getCounts();
    const orderPizzaRequests = Object.entries(counts)
      .filter(([, quantity]) => quantity > 0)
      .map(([pizzaId, quantity]) => ({
        pizzaId: Number(pizzaId),
        quantity
      }));

    return { orderPizzaRequests }
  }
}
