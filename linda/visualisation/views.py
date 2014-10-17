from django.shortcuts import render
from linda_app.models import DatasourceDescription

def visualizations(request):
    params = {}
    return render(request, 'visual/index.html', params)


def visualizeDatasource(request, **kwargs):
    params = {}
    params['datasource'] = DatasourceDescription.objects.get(name=kwargs.get('dtname'))

    return render(request, 'visual/datasource.html', params)
