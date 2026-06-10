from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import AllowAny

# Инструменты для документирования в Swagger
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from webapp.models import Category, Product, Order
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer


class CategoryViewSet(ListModelMixin, GenericViewSet):
    """
    Отдает список категорий.
    Доступ: GET /api/v1/categories/
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductViewSet(ListModelMixin, GenericViewSet):
    """
    Отдает список товаров.
    Доступ: GET /api/v1/products/
    Поддерживает фильтрацию: GET /api/v1/products/?category=protein
    """
    queryset = Product.objects.all()  # Показываем только активные товары
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    # Добавляем описание фильтра для Swagger
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='category',
                description='Слаг категории для фильтрации товаров (например: protein)',
                required=False,
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
            )
        ]
    )

    def list(self, request, *args, **kwargs):
        # Метод list переопределен только ради декоратора @extend_schema
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        # Кастомная фильтрация по категории
        queryset = super().get_queryset()
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset


class OrderViewSet(ModelViewSet):
    """
    POST /api/v1/orders/
    Принимает заказ со списком товаров.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post'] # Разрешаем ТОЛЬКО создавать заказы (без просмотра списка)