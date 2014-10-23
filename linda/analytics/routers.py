class analyticsRouter(object): 
    def db_for_read(self, model, **hints):
        "Point all operations on analytics models to 'analytics'"
        if model._meta.app_label == 'analytics':
            return 'analytics'
        return 'default'

    def db_for_write(self, model, **hints):
        "Point all operations on analytics models to 'analytics'"
        if model._meta.app_label == 'analytics':
            return 'analytics'
        return 'default'
    
    def allow_relation(self, obj1, obj2, **hints):
        "Allow any relation if a both models in analytics app"
        if obj1._meta.app_label == 'analytics' and obj2._meta.app_label == 'analytics':
            return True
        # Allow if neither is analytics app
        elif 'analytics' not in [obj1._meta.app_label, obj2._meta.app_label]: 
            return True
        return False
    
    def allow_syncdb(self, db, model):
        if db == 'analytics' or model._meta.app_label == "analytics":
            return True # we're not using syncdb on our legacy database
        else: # but all other models/databases are fine
            return False

 
