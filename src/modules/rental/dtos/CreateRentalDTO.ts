export class CreateRentalDTO {
  car_id: string;

  user_id: string;

  start_date: Date;

  expected_return_date: Date;

  car_daily_value: number;

  car_daily_fine: number;

  estimated_total: number;
}
