import { Component, computed, effect, inject, signal } from '@angular/core';
import { ThongTinCongTyService } from './thong-tin-cong-ty-service';
import { environment } from '../../../environments/environment.development';
import { AnnouncementService } from '../../components/dialog/announcement-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-thong-tin-cong-ty',
  imports: [ReactiveFormsModule],
  templateUrl: './thong-tin-cong-ty.html',
  providers: [ThongTinCongTyService],
  styleUrl: './thong-tin-cong-ty.css'
})
export class ThongTinCongTy {
  service = inject(ThongTinCongTyService);
  selectedId = signal<number | null>(null);
  cdnUrl = environment.cdnUrl;
  launch = computed(() => ({
    reload: this.reload()
  }));
  reload = signal<boolean>(false);
  thongbao = inject(AnnouncementService);
  fb = inject(FormBuilder);
  LogoFile: File | null = null;
  hinhFile: File | null = null;
  logoReview: string | null = null;
  hinhReview: string | null = null;
  logoImage: string | null = null;
  hinhImage: string | null = null;
  id: number | null = null;

  constructor() {
    effect(() => {
      this.reload();

      this.service.getList().subscribe({
        next: response => {
          this.formData.patchValue(
            {
              ten_cty: response.ten_cty,
              logo: response.logo,
              dia_chi: response.dia_chi,
              email: response.email,
              sdt: response.sdt,
              ma_so_thue: response.ma_so_thue,
              hien_thi: response.hien_thi,
              hinh: response.hinh,
              slogan: response.slogan,
              linh_vuc: response.linh_vuc,
              nam_thanh_lap: response.nam_thanh_lap
            }
          )
          this.logoImage = response.logo;
          this.hinhImage = response.hinh;
          this.id = response.id;
        },
        error: error => {
          this.thongbao.hienThi('Có lỗi xảy ra khi lấy dữ liệu', 'Thông báo');
          console.error('Error fetching data:', error);
        }
      })
    });
  }

  formData = this.fb.group({
    ten_cty: ['', [Validators.required]],
    logo: [''],
    dia_chi: ['', [Validators.required]],
    email: ['', [Validators.required]],
    sdt: ['', [Validators.required]],
    ma_so_thue: ['', [Validators.required]],
    hien_thi: [true, [Validators.required]],
    hinh: [''],
    slogan: ['', [Validators.required]],
    linh_vuc: ['', [Validators.required]],
    nam_thanh_lap: [new Date().toISOString().split('T')[0], [Validators.required]],
  });

  resetData() {
    this.formData.reset({
      ten_cty: '',
      logo: '',
      dia_chi: '',
      email: '',
      sdt: '',
      ma_so_thue: '',
      hien_thi: true,
      hinh: '',
      slogan: '',
      linh_vuc: '',
      nam_thanh_lap: new Date().toISOString().split('T')[0]
    })
    this.LogoFile = null;
    this.hinhFile = null;
    this.logoImage = null;
    this.hinhImage = null;
    if (this.logoReview) {
      URL.revokeObjectURL(this.logoReview);
    }

    if (this.hinhReview) {
      URL.revokeObjectURL(this.hinhReview);
    }
    this.reload.update(taiLai => !taiLai);
  }

  async onSubmit() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    const data = new FormData();
    data.append('ten_cty', this.formData.get('ten_cty')?.value ?? '');
    data.append('dia_chi', this.formData.get('dia_chi')?.value ?? '');
    data.append('email', this.formData.get('email')?.value ?? '');
    data.append('sdt', this.formData.get('sdt')?.value ?? '');
    data.append('ma_so_thue', this.formData.get('ma_so_thue')?.value ?? '');
    data.append('hien_thi', String(this.formData.get('hien_thi')?.value ?? 'false'));
    data.append('slogan', this.formData.get('slogan')?.value ?? '');
    data.append('linh_vuc', this.formData.get('linh_vuc')?.value ?? '');
    data.append('nam_thanh_lap', this.formData.get('nam_thanh_lap')?.value ?? '');

    if (this.LogoFile) {
      data.append('logoFile', this.LogoFile, this.LogoFile.name);
    }

    if (this.hinhFile) {
      data.append('hinhFile', this.hinhFile, this.hinhFile.name);
    }

    if (this.id === null) {
      this.service.insert(data).subscribe({
        next: response => {
          this.thongbao.hienThi('Đã tạo mới thành công', 'Thông báo');
          this.resetData();
        },
        error: error => {
          console.error('Error inserting data:', error);
        }
      });
    } else {

      this.service.update(this.id, data).subscribe({
        next: response => {
          this.thongbao.hienThi('Cập nhật thành công', 'Thông báo');
          this.resetData();
        },
        error: error => {
          console.error('Error updating data:', error);
          this.thongbao.hienThi('Có lỗi xảy ra khi cập nhật dữ liệu', 'Thông báo');
        }
      });
    }
  }

  onLogoSelected(e: Event) {
    const file = this.assignFileSelected(e);
    if (!file) return;
    this.LogoFile = file;
    if (this.logoReview) {
      URL.revokeObjectURL(this.logoReview);
    }
    this.logoReview = URL.createObjectURL(file);
  }

  onHinhSelected(e: Event) {
    const file = this.assignFileSelected(e);
    if (!file) return;
    this.hinhFile = file;
    if (this.hinhReview) {
      URL.revokeObjectURL(this.hinhReview);
    }
    this.hinhReview = URL.createObjectURL(file);
  }

  assignFileSelected(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return null;
    }
    if (!file.type.startsWith('image/')) {
      this.thongbao.hienThi(
        'Vui lòng chọn file hình ảnh hợp lệ',
        'Thông báo'
      );
      return null;
    }
    return file;
  }

  ngOnDestroy(): void {
    if (this.logoReview) {
      URL.revokeObjectURL(this.logoReview);
    }

    if (this.hinhReview) {
      URL.revokeObjectURL(this.hinhReview);
    }
  }

}
