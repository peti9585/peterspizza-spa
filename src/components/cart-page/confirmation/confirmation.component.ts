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

@Component({
  selector: 'app-confirmation',
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    FormsModule
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {
  formGroup: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly pizzaService = inject(PizzaService);
  private readonly cartService = inject(CartService);
  private readonly toasterService = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<ConfirmationComponent>);

  constructor() {
    this.formGroup = this.formBuilder.group({
      fullName: [{ value: 'Kis Péter', disabled: true }],
      phoneNumber: [{ value: '0917201493', disabled: true }],
      email: [{ value: 'peti9585@gmail.com', disabled: true }]
      }
    );
  }

  sendOrder() {
    const request = this.constructOrderRequest();
    this.pizzaService.sendOrder(request).subscribe({
      next: (_) => {
        this.cartService.removeAllFromCart();
        this.router.navigate(['/home']);
        this.dialogRef.close();
        this.toasterService.success('A rendelés sikeres volt! A rendelés állapotát a fiók menüpontban követheti nyomon.');
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

    return {
      userId: 1,
      orderPizzaRequests
    }
  }
}
