{{- define "release_labels" }}
app: {{ .Chart.Name | trunc 63 }}
version: {{ .Chart.Version }}
release: {{ .Release.Name }}
{{- end }}

{{- define "name" -}}
{{- .Release.Name | trunc 63 -}}
{{- end -}}

{{- define "api_name" -}}
{{- printf "%s-%s" .Release.Name "api" | trunc 63 -}}
{{- end -}}

{{- define "db_name" -}}
{{- printf "%s-%s" .Release.Name "db" | trunc 63 -}}
{{- end -}}

{{- define "web_name" -}}
{{- printf "%s-%s" .Release.Name "web" | trunc 63 -}}
{{- end -}}
