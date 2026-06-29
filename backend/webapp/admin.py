from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline
from .models import Category, Product, Order, OrderItem


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = ('image_preview', 'name', 'price', 'category', 'is_original')
    list_display_links = ('name',)
    list_editable = ('price', 'category', 'is_original')   # правка прямо в списке
    list_filter = ('category', 'is_original')
    search_fields = ('name', 'description')
    autocomplete_fields = ('category',)
    list_per_page = 20
    ordering = ('name',)
    readonly_fields = ('image_big',)
    fieldsets = (
        ("Основное", {"fields": ("name", "category", "price", "is_original")}),
        ("Описание", {"fields": ("description",)}),
        ("Фото", {"fields": ("image", "image_big")}),
    )

    @admin.display(description="Фото")
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" loading="lazy" style="width:46px;height:46px;'
                'object-fit:cover;border-radius:8px;" />', obj.image.url)
        return "—"

    @admin.display(description="Текущее фото")
    def image_big(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width:240px;border-radius:12px;" />', obj.image.url)
        return "Фото не загружено"


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ('name', 'product_count')
    search_fields = ('name',)

    @admin.display(description="Товаров")
    def product_count(self, obj):
        return obj.products.count()


class OrderItemInline(TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'price', 'quantity')
    can_delete = False


@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ('id', 'first_name', 'phone', 'total_amount', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('phone', 'first_name', 'id')
    readonly_fields = ('total_amount', 'created_at')
    inlines = (OrderItemInline,)