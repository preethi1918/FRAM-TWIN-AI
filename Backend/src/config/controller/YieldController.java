package com.farmtwin.controller;

import com.farmtwin.dto.Requests.YieldRequest;
import com.farmtwin.service.MLClientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/yield")
public class YieldController {

    private final MLClientService mlClientService;

    @Autowired
    public YieldController(MLClientService mlClientService) {
        this.mlClientService = mlClientService;
    }

    @PostMapping("/predict")
    public Mono<Map> predictYield(@Valid @RequestBody YieldRequest request) {
        return mlClientService.predictYield(request);
    }
}
