'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">infield-analysis-portal documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AboutModule.html" data-type="entity-link">AboutModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AboutModule-1a1a7148634ef4ad5a035502b6b333fc"' : 'data-target="#xs-components-links-module-AboutModule-1a1a7148634ef4ad5a035502b6b333fc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AboutModule-1a1a7148634ef4ad5a035502b6b333fc"' :
                                            'id="xs-components-links-module-AboutModule-1a1a7148634ef4ad5a035502b6b333fc"' }>
                                            <li class="link">
                                                <a href="components/AboutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AboutComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AboutRoutingModule.html" data-type="entity-link">AboutRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AccessDeniedModule.html" data-type="entity-link">AccessDeniedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AccessDeniedModule-156e350e58e2a57e121a76ab49803f68"' : 'data-target="#xs-components-links-module-AccessDeniedModule-156e350e58e2a57e121a76ab49803f68"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AccessDeniedModule-156e350e58e2a57e121a76ab49803f68"' :
                                            'id="xs-components-links-module-AccessDeniedModule-156e350e58e2a57e121a76ab49803f68"' }>
                                            <li class="link">
                                                <a href="components/AccessDeniedComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AccessDeniedComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AccessDeniedRoutingModule.html" data-type="entity-link">AccessDeniedRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminApplicationsAccessesModule.html" data-type="entity-link">AdminApplicationsAccessesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminApplicationsAccessesModule-e5677d3d5de592c4f9eb29ce9e98b264"' : 'data-target="#xs-components-links-module-AdminApplicationsAccessesModule-e5677d3d5de592c4f9eb29ce9e98b264"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminApplicationsAccessesModule-e5677d3d5de592c4f9eb29ce9e98b264"' :
                                            'id="xs-components-links-module-AdminApplicationsAccessesModule-e5677d3d5de592c4f9eb29ce9e98b264"' }>
                                            <li class="link">
                                                <a href="components/ApplicationsAccessesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ApplicationsAccessesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminApplicationsAccessesRoutingModule.html" data-type="entity-link">AdminApplicationsAccessesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminClientsModule.html" data-type="entity-link">AdminClientsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminClientsModule-d6a1f147dab406bd1fbaa871e4853f33"' : 'data-target="#xs-components-links-module-AdminClientsModule-d6a1f147dab406bd1fbaa871e4853f33"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminClientsModule-d6a1f147dab406bd1fbaa871e4853f33"' :
                                            'id="xs-components-links-module-AdminClientsModule-d6a1f147dab406bd1fbaa871e4853f33"' }>
                                            <li class="link">
                                                <a href="components/ClientsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClientsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminClientsRoutingModule.html" data-type="entity-link">AdminClientsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminCountriesModule.html" data-type="entity-link">AdminCountriesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminCountriesModule-091189e74e46a7508ba92d79b275036e"' : 'data-target="#xs-components-links-module-AdminCountriesModule-091189e74e46a7508ba92d79b275036e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminCountriesModule-091189e74e46a7508ba92d79b275036e"' :
                                            'id="xs-components-links-module-AdminCountriesModule-091189e74e46a7508ba92d79b275036e"' }>
                                            <li class="link">
                                                <a href="components/CountriesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CountriesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminCountriesRoutingModule.html" data-type="entity-link">AdminCountriesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminExplanationsModule.html" data-type="entity-link">AdminExplanationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminExplanationsModule-ad73cf1f6a9493f5b915e0a60ddccaac"' : 'data-target="#xs-components-links-module-AdminExplanationsModule-ad73cf1f6a9493f5b915e0a60ddccaac"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminExplanationsModule-ad73cf1f6a9493f5b915e0a60ddccaac"' :
                                            'id="xs-components-links-module-AdminExplanationsModule-ad73cf1f6a9493f5b915e0a60ddccaac"' }>
                                            <li class="link">
                                                <a href="components/ExplanationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExplanationsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminExplanationsRoutingModule.html" data-type="entity-link">AdminExplanationsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminForecastersModule.html" data-type="entity-link">AdminForecastersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminForecastersModule-bdc06b0b5139fc84a1f535c224604702"' : 'data-target="#xs-components-links-module-AdminForecastersModule-bdc06b0b5139fc84a1f535c224604702"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminForecastersModule-bdc06b0b5139fc84a1f535c224604702"' :
                                            'id="xs-components-links-module-AdminForecastersModule-bdc06b0b5139fc84a1f535c224604702"' }>
                                            <li class="link">
                                                <a href="components/ForecastersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForecastersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminForecastersRoutingModule.html" data-type="entity-link">AdminForecastersRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminLogsModule.html" data-type="entity-link">AdminLogsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminLogsModule-bd6a125140f85102ac4c74c41009c7f1"' : 'data-target="#xs-components-links-module-AdminLogsModule-bd6a125140f85102ac4c74c41009c7f1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminLogsModule-bd6a125140f85102ac4c74c41009c7f1"' :
                                            'id="xs-components-links-module-AdminLogsModule-bd6a125140f85102ac4c74c41009c7f1"' }>
                                            <li class="link">
                                                <a href="components/LogsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapLocationLogsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MapLocationLogsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminLogsRoutingModule.html" data-type="entity-link">AdminLogsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminNotificationsModule.html" data-type="entity-link">AdminNotificationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminNotificationsModule-1f15eb8ef328bd78f9f7d6c4a00181f9"' : 'data-target="#xs-components-links-module-AdminNotificationsModule-1f15eb8ef328bd78f9f7d6c4a00181f9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminNotificationsModule-1f15eb8ef328bd78f9f7d6c4a00181f9"' :
                                            'id="xs-components-links-module-AdminNotificationsModule-1f15eb8ef328bd78f9f7d6c4a00181f9"' }>
                                            <li class="link">
                                                <a href="components/NotificationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotificationsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminNotificationsRoutingModule.html" data-type="entity-link">AdminNotificationsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminPanelModule.html" data-type="entity-link">AdminPanelModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminPanelModule-75089e8cd6f9708aa6ece64f97a3dfe0"' : 'data-target="#xs-components-links-module-AdminPanelModule-75089e8cd6f9708aa6ece64f97a3dfe0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminPanelModule-75089e8cd6f9708aa6ece64f97a3dfe0"' :
                                            'id="xs-components-links-module-AdminPanelModule-75089e8cd6f9708aa6ece64f97a3dfe0"' }>
                                            <li class="link">
                                                <a href="components/AdminPanelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminPanelFeatureComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminPanelFeatureComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminPanelRoutingModule.html" data-type="entity-link">AdminPanelRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminProductsModule.html" data-type="entity-link">AdminProductsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminProductsModule-84d2de445a65737f57c5ca4ef483c70f"' : 'data-target="#xs-components-links-module-AdminProductsModule-84d2de445a65737f57c5ca4ef483c70f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminProductsModule-84d2de445a65737f57c5ca4ef483c70f"' :
                                            'id="xs-components-links-module-AdminProductsModule-84d2de445a65737f57c5ca4ef483c70f"' }>
                                            <li class="link">
                                                <a href="components/ProductsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProductsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminProductsRoutingModule.html" data-type="entity-link">AdminProductsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminProjectsModule.html" data-type="entity-link">AdminProjectsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminProjectsRoutingModule.html" data-type="entity-link">AdminProjectsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminRegionsModule.html" data-type="entity-link">AdminRegionsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminRegionsModule-7e11bbf8224018ac75216857ac1cb405"' : 'data-target="#xs-components-links-module-AdminRegionsModule-7e11bbf8224018ac75216857ac1cb405"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminRegionsModule-7e11bbf8224018ac75216857ac1cb405"' :
                                            'id="xs-components-links-module-AdminRegionsModule-7e11bbf8224018ac75216857ac1cb405"' }>
                                            <li class="link">
                                                <a href="components/RegionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegionsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminRegionsRoutingModule.html" data-type="entity-link">AdminRegionsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminRequestsModule.html" data-type="entity-link">AdminRequestsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminRequestsRoutingModule.html" data-type="entity-link">AdminRequestsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminUsersModule.html" data-type="entity-link">AdminUsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminUsersModule-e9e0c93ba4d928d3328485aed582d470"' : 'data-target="#xs-components-links-module-AdminUsersModule-e9e0c93ba4d928d3328485aed582d470"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminUsersModule-e9e0c93ba4d928d3328485aed582d470"' :
                                            'id="xs-components-links-module-AdminUsersModule-e9e0c93ba4d928d3328485aed582d470"' }>
                                            <li class="link">
                                                <a href="components/UsersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminUsersRoutingModule.html" data-type="entity-link">AdminUsersRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminVesselsModule.html" data-type="entity-link">AdminVesselsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminVesselsModule-55f9f7bbf0cfdeb44c4519de2f41cf3c"' : 'data-target="#xs-components-links-module-AdminVesselsModule-55f9f7bbf0cfdeb44c4519de2f41cf3c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminVesselsModule-55f9f7bbf0cfdeb44c4519de2f41cf3c"' :
                                            'id="xs-components-links-module-AdminVesselsModule-55f9f7bbf0cfdeb44c4519de2f41cf3c"' }>
                                            <li class="link">
                                                <a href="components/VesselsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VesselsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminVesselsRoutingModule.html" data-type="entity-link">AdminVesselsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminVesselsTypesModule.html" data-type="entity-link">AdminVesselsTypesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminVesselsTypesModule-add46bad19fc6907c97145d973d226e3"' : 'data-target="#xs-components-links-module-AdminVesselsTypesModule-add46bad19fc6907c97145d973d226e3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminVesselsTypesModule-add46bad19fc6907c97145d973d226e3"' :
                                            'id="xs-components-links-module-AdminVesselsTypesModule-add46bad19fc6907c97145d973d226e3"' }>
                                            <li class="link">
                                                <a href="components/VesselsTypesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VesselsTypesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminVesselsTypesRoutingModule.html" data-type="entity-link">AdminVesselsTypesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AnalysisHistoryModule.html" data-type="entity-link">AnalysisHistoryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AnalysisHistoryModule-e1246e06420e1e7096b9901bc71e89ee"' : 'data-target="#xs-components-links-module-AnalysisHistoryModule-e1246e06420e1e7096b9901bc71e89ee"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AnalysisHistoryModule-e1246e06420e1e7096b9901bc71e89ee"' :
                                            'id="xs-components-links-module-AnalysisHistoryModule-e1246e06420e1e7096b9901bc71e89ee"' }>
                                            <li class="link">
                                                <a href="components/HistoryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoryFeatureAnalysisComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoryFeatureAnalysisComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoryFeatureForecastsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoryFeatureForecastsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoryFeatureInfoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoryFeatureInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoryFeatureSummaryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoryFeatureSummaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoryFeatureViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoryFeatureViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoryFeaturesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoryFeaturesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AnalysisHistoryRoutingModule.html" data-type="entity-link">AnalysisHistoryRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-a59a52222af3783d58e086d146aa7c3f"' : 'data-target="#xs-components-links-module-AppModule-a59a52222af3783d58e086d146aa7c3f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-a59a52222af3783d58e086d146aa7c3f"' :
                                            'id="xs-components-links-module-AppModule-a59a52222af3783d58e086d146aa7c3f"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-f37a69ac7989eb66a90a7c7009fc295b"' : 'data-target="#xs-injectables-links-module-CoreModule-f37a69ac7989eb66a90a7c7009fc295b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-f37a69ac7989eb66a90a7c7009fc295b"' :
                                        'id="xs-injectables-links-module-CoreModule-f37a69ac7989eb66a90a7c7009fc295b"' }>
                                        <li class="link">
                                            <a href="injectables/AnalysisService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AnalysisService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ApplicationsAccessesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ApplicationsAccessesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthenticationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CacheService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CacheService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ClientsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ClientsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CountriesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CountriesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ErrorService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ErrorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>EventsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ExplanationsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ExplanationsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ForecastersService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ForecastersService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LoaderService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LoaderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LogsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LogsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/NotificationsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>NotificationsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProductsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProductsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProfilerService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProfilerService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProjectsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProjectsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PushNotificationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PushNotificationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RegionsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RegionsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RequestsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RequestsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SchedulersService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SchedulersService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TitlePageService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TitlePageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UploadService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UploadService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserSharingService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserSharingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UsersService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VesselsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>VesselsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VesselsTypesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>VesselsTypesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WeatherService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>WeatherService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WebsocketsServiceService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>WebsocketsServiceService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link">DashboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DashboardModule-9b9a5022ce07f4dd196f6a29b4fbab8d"' : 'data-target="#xs-components-links-module-DashboardModule-9b9a5022ce07f4dd196f6a29b4fbab8d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardModule-9b9a5022ce07f4dd196f6a29b4fbab8d"' :
                                            'id="xs-components-links-module-DashboardModule-9b9a5022ce07f4dd196f6a29b4fbab8d"' }>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardFeatureProjectCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardFeatureProjectCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardFeatureProjectProductComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardFeatureProjectProductComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardFeatureProjectProgressbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardFeatureProjectProgressbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardFeatureProjectUpatedDateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardFeatureProjectUpatedDateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardFeaturesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardFeaturesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardMapCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardMapCardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardRoutingModule.html" data-type="entity-link">DashboardRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DownloadCenterModule.html" data-type="entity-link">DownloadCenterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DownloadCenterModule-0352beb2b0e539f8c1adf34818bab955"' : 'data-target="#xs-components-links-module-DownloadCenterModule-0352beb2b0e539f8c1adf34818bab955"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DownloadCenterModule-0352beb2b0e539f8c1adf34818bab955"' :
                                            'id="xs-components-links-module-DownloadCenterModule-0352beb2b0e539f8c1adf34818bab955"' }>
                                            <li class="link">
                                                <a href="components/DownloadCenterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DownloadCenterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DownloadCenterRoutingModule.html" data-type="entity-link">DownloadCenterRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoginModule.html" data-type="entity-link">LoginModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginModule-920cac278bb92ccd0360a07178c7d9bd"' : 'data-target="#xs-components-links-module-LoginModule-920cac278bb92ccd0360a07178c7d9bd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginModule-920cac278bb92ccd0360a07178c7d9bd"' :
                                            'id="xs-components-links-module-LoginModule-920cac278bb92ccd0360a07178c7d9bd"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginFeatureComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginFeatureComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginRoutingModule.html" data-type="entity-link">LoginRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NgBootstrapModule.html" data-type="entity-link">NgBootstrapModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NgLeafletModule.html" data-type="entity-link">NgLeafletModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NgSocketsModule.html" data-type="entity-link">NgSocketsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NotFoundModule.html" data-type="entity-link">NotFoundModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-NotFoundModule-50883c7183925d1636c0198959442457"' : 'data-target="#xs-components-links-module-NotFoundModule-50883c7183925d1636c0198959442457"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NotFoundModule-50883c7183925d1636c0198959442457"' :
                                            'id="xs-components-links-module-NotFoundModule-50883c7183925d1636c0198959442457"' }>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotFoundRoutingModule.html" data-type="entity-link">NotFoundRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link">ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProfileModule-a012d3837993469afba84a60d8772f6f"' : 'data-target="#xs-components-links-module-ProfileModule-a012d3837993469afba84a60d8772f6f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProfileModule-a012d3837993469afba84a60d8772f6f"' :
                                            'id="xs-components-links-module-ProfileModule-a012d3837993469afba84a60d8772f6f"' }>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileFeatureCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileFeatureCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileFeatureComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileFeatureComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileRoutingModule.html" data-type="entity-link">ProfileRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectsModule.html" data-type="entity-link">ProjectsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProjectsModule-0565088929165d66c44b0c87644b7402"' : 'data-target="#xs-components-links-module-ProjectsModule-0565088929165d66c44b0c87644b7402"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProjectsModule-0565088929165d66c44b0c87644b7402"' :
                                            'id="xs-components-links-module-ProjectsModule-0565088929165d66c44b0c87644b7402"' }>
                                            <li class="link">
                                                <a href="components/ProjectFeatureAnalysisComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectFeatureAnalysisComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectFeatureCompareComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectFeatureCompareComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectFeatureComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectFeatureComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectFeatureContactCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectFeatureContactCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectFeatureForecastsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectFeatureForecastsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectFeatureInfoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectFeatureInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectFeatureSummaryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectFeatureSummaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectFeatureViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectFeatureViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectsRoutingModule.html" data-type="entity-link">ProjectsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProtectedModule.html" data-type="entity-link">ProtectedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProtectedModule-2faa02303dcde0e80dc90b2ca0600b30"' : 'data-target="#xs-components-links-module-ProtectedModule-2faa02303dcde0e80dc90b2ca0600b30"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProtectedModule-2faa02303dcde0e80dc90b2ca0600b30"' :
                                            'id="xs-components-links-module-ProtectedModule-2faa02303dcde0e80dc90b2ca0600b30"' }>
                                            <li class="link">
                                                <a href="components/ProtectedComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProtectedComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProtectedRoutingModule.html" data-type="entity-link">ProtectedRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PublicModule.html" data-type="entity-link">PublicModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PublicRoutingModule.html" data-type="entity-link">PublicRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterModule.html" data-type="entity-link">RegisterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RegisterModule-10288f1e4c995a456b85f60b65ce35e8"' : 'data-target="#xs-components-links-module-RegisterModule-10288f1e4c995a456b85f60b65ce35e8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegisterModule-10288f1e4c995a456b85f60b65ce35e8"' :
                                            'id="xs-components-links-module-RegisterModule-10288f1e4c995a456b85f60b65ce35e8"' }>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterFeatureComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterFeatureComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterRoutingModule.html" data-type="entity-link">RegisterRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RequestsModule.html" data-type="entity-link">RequestsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RequestsModule-f8feaf9521dd6f792f3fd0ae6cbcb428"' : 'data-target="#xs-components-links-module-RequestsModule-f8feaf9521dd6f792f3fd0ae6cbcb428"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RequestsModule-f8feaf9521dd6f792f3fd0ae6cbcb428"' :
                                            'id="xs-components-links-module-RequestsModule-f8feaf9521dd6f792f3fd0ae6cbcb428"' }>
                                            <li class="link">
                                                <a href="components/RequestsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RequestsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RequestsFeatureComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RequestsFeatureComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RequestsRoutingModule.html" data-type="entity-link">RequestsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SchedulerModule.html" data-type="entity-link">SchedulerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SchedulerModule-80f541b78b370f02d45319c62a5829f6"' : 'data-target="#xs-components-links-module-SchedulerModule-80f541b78b370f02d45319c62a5829f6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SchedulerModule-80f541b78b370f02d45319c62a5829f6"' :
                                            'id="xs-components-links-module-SchedulerModule-80f541b78b370f02d45319c62a5829f6"' }>
                                            <li class="link">
                                                <a href="components/SchedulerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SchedulerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SchedulerFeatureGanttComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SchedulerFeatureGanttComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SchedulerFeatureTableComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SchedulerFeatureTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SchedulerFeatureViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SchedulerFeatureViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SchedulerFeaturesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SchedulerFeaturesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SchedulerRoutingModule.html" data-type="entity-link">SchedulerRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' : 'data-target="#xs-components-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' :
                                            'id="xs-components-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' }>
                                            <li class="link">
                                                <a href="components/FooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationsCenterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotificationsCenterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UploadComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UploadComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' : 'data-target="#xs-directives-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' :
                                        'id="xs-directives-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' }>
                                        <li class="link">
                                            <a href="directives/RisksProgressbarDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">RisksProgressbarDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' : 'data-target="#xs-pipes-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' :
                                            'id="xs-pipes-links-module-SharedModule-80c60e924be9279be8e36f327102f102"' }>
                                            <li class="link">
                                                <a href="pipes/MomentDatePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MomentDatePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/WeatherModule.html" data-type="entity-link">WeatherModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-WeatherModule-7c41e846d09ec9499a8d3bfc1f249f5b"' : 'data-target="#xs-components-links-module-WeatherModule-7c41e846d09ec9499a8d3bfc1f249f5b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WeatherModule-7c41e846d09ec9499a8d3bfc1f249f5b"' :
                                            'id="xs-components-links-module-WeatherModule-7c41e846d09ec9499a8d3bfc1f249f5b"' }>
                                            <li class="link">
                                                <a href="components/WeatherComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WeatherComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/WeatherRoutingModule.html" data-type="entity-link">WeatherRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/WindyModule.html" data-type="entity-link">WindyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-WindyModule-f1d5ed1d04a5f10768d77b4628c6fc6a"' : 'data-target="#xs-components-links-module-WindyModule-f1d5ed1d04a5f10768d77b4628c6fc6a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WindyModule-f1d5ed1d04a5f10768d77b4628c6fc6a"' :
                                            'id="xs-components-links-module-WindyModule-f1d5ed1d04a5f10768d77b4628c6fc6a"' }>
                                            <li class="link">
                                                <a href="components/WindyComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WindyComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ExplanationsComponent.html" data-type="entity-link">ExplanationsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HistoryFeatureInfoComponent.html" data-type="entity-link">HistoryFeatureInfoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectsComponent-1.html" data-type="entity-link">ProjectsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RequestsComponent-1.html" data-type="entity-link">RequestsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VesselsTypesComponent.html" data-type="entity-link">VesselsTypesComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AnalysisService.html" data-type="entity-link">AnalysisService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApplicationsAccessesService.html" data-type="entity-link">ApplicationsAccessesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link">AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CacheService.html" data-type="entity-link">CacheService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClientsService.html" data-type="entity-link">ClientsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CountriesService.html" data-type="entity-link">CountriesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorService.html" data-type="entity-link">ErrorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventsService.html" data-type="entity-link">EventsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExplanationsService.html" data-type="entity-link">ExplanationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ForecastersService.html" data-type="entity-link">ForecastersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoaderService.html" data-type="entity-link">LoaderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LogsService.html" data-type="entity-link">LogsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link">NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductsService.html" data-type="entity-link">ProductsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfilerService.html" data-type="entity-link">ProfilerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectsService.html" data-type="entity-link">ProjectsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PushNotificationService.html" data-type="entity-link">PushNotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RegionsService.html" data-type="entity-link">RegionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestsService.html" data-type="entity-link">RequestsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SchedulersService.html" data-type="entity-link">SchedulersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TimeAdapter.html" data-type="entity-link">TimeAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TimestampAdapter.html" data-type="entity-link">TimestampAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TimestampFormatter.html" data-type="entity-link">TimestampFormatter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TitlePageService.html" data-type="entity-link">TitlePageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UploadService.html" data-type="entity-link">UploadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserSharingService.html" data-type="entity-link">UserSharingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link">UsersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VesselsService.html" data-type="entity-link">VesselsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VesselsTypesService.html" data-type="entity-link">VesselsTypesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WeatherService.html" data-type="entity-link">WeatherService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WebsocketsServiceService.html" data-type="entity-link">WebsocketsServiceService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthenticationInterceptor.html" data-type="entity-link">AuthenticationInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/CacheInterceptor.html" data-type="entity-link">CacheInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/ConvertInterceptor.html" data-type="entity-link">ConvertInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/ErrorInterceptor.html" data-type="entity-link">ErrorInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/HeaderInterceptor.html" data-type="entity-link">HeaderInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/LoaderInterceptor.html" data-type="entity-link">LoaderInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/ProfilerInterceptor.html" data-type="entity-link">ProfilerInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/RetryInterceptor.html" data-type="entity-link">RetryInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AccessGuard.html" data-type="entity-link">AccessGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthenticationGuard.html" data-type="entity-link">AuthenticationGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Analysis.html" data-type="entity-link">Analysis</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApplicationAccess.html" data-type="entity-link">ApplicationAccess</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Client.html" data-type="entity-link">Client</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Country.html" data-type="entity-link">Country</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Email.html" data-type="entity-link">Email</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ErrorResponse.html" data-type="entity-link">ErrorResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Event.html" data-type="entity-link">Event</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Explanation.html" data-type="entity-link">Explanation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Forecaster.html" data-type="entity-link">Forecaster</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpResponse.html" data-type="entity-link">HttpResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Jwt.html" data-type="entity-link">Jwt</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Log.html" data-type="entity-link">Log</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Login.html" data-type="entity-link">Login</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notification.html" data-type="entity-link">Notification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Product.html" data-type="entity-link">Product</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgressBar.html" data-type="entity-link">ProgressBar</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Project.html" data-type="entity-link">Project</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Region.html" data-type="entity-link">Region</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Request.html" data-type="entity-link">Request</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Scheduler.html" data-type="entity-link">Scheduler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskScheduler.html" data-type="entity-link">TaskScheduler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Vessel.html" data-type="entity-link">Vessel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VesselType.html" data-type="entity-link">VesselType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebSocketResponse.html" data-type="entity-link">WebSocketResponse</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise-inverted.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});