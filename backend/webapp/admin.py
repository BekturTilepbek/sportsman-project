from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, OrderItem, Order


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('image_tag', 'name', 'price', 'category', 'is_original')
    list_filter = ('category', 'is_original')
    search_fields = ('name', 'description')
    list_per_page = 20  # меньше фото на страницу — быстрее грузится

    # Функция для вывода миниатюры картинки в списке товаров
    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" loading="lazy" style="width: 50px; height:50px; object-fit:cover;" />',
                obj.image.url)
        return "-"
    image_tag.short_description = 'Фото'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'price', 'quantity') # Чтобы менеджер случайно не поменял состав заказа

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'phone', 'total_amount', 'created_at')
    list_filter = ['created_at']
    search_fields = ('phone', 'first_name', 'id')
    inlines = [OrderItemInline] # Показываем товары прямо внутри страницы заказа
    readonly_fields = ('total_amount', 'created_at')